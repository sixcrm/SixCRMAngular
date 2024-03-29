import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {EventFunnel} from '../../../shared/models/event-funnel.model';
import {EventFunnelTimeseries} from "../../../shared/models/event-funnel-timeseries.model";
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Moment} from 'moment';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';

@Component({
  selector: 'funnel-graph',
  templateUrl: './funnel-graph.component.html',
  styleUrls: ['./funnel-graph.component.scss']
})
export class FunnelGraphComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  public eventType: 'click' | 'lead' | 'main' | 'upsell' | 'confirm';

  @Input() simpleChart: boolean = false;
  @Input() period: string = 'DAY';

  showChart: boolean;
  showEventOptions: boolean = false;
  numberOfDays: number = 30;
  startDate: Moment;
  chart;
  funnel: EventFunnel;
  funnelTimeseries : EventFunnelTimeseries;

  chartOptions =  {
    chart: {
      type: 'column',
      backgroundColor: '#FAFAFA',
      height: 370
    },
    title: { text: null },
    credits: { enabled: false },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m/%e',
        week: '%m/%e',
        month: '%m/%e'
      }
    },
    yAxis: {
      title: { enabled: false },
      gridLineWidth: 0
    },
    tooltip: { enabled: false },
    legend: { enabled: false },
    plotOptions: {
      line: {
        fillOpacity: 1,
        marker: { enabled: false }
      }
    },
    series: [
      {
        name: '',
        color: '#F4F4F4',
        data: [3, 3, 5, 4, 6, 8, 6, 9, 10, 9, 10],
        lineWidth: 2,
        pointStart: moment().subtract(this.numberOfDays, 'd'),
        pointInterval: 24 * 3600 * 1000 //one day
      }
    ]
  };

  eventTypeMap = {
    'click': 'DASHBOARD_EVENTSFUNNEL_CLICK',
    'lead': 'DASHBOARD_EVENTSFUNNEL_LEAD',
    'main': 'DASHBOARD_EVENTSFUNNEL_MAIN',
    'upsell': 'DASHBOARD_EVENTSFUNNEL_UPSELL',
    'confirm': 'DASHBOARD_EVENTSFUNNEL_CONFIRM'
  };

  periodMap = {
    '7': 'Week',
    '30': 'Month'
  };

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    const funnelStream = this.simpleChart ? this.analyticsService.eventFunnelSimple$ : this.analyticsService.eventFunnel$;
    const eventFunnelStream = this.simpleChart ? this.analyticsService.eventFunnelTimeseriesSimple$ : this.analyticsService.eventFunnelTimeseries$;

    funnelStream.takeUntil(this.unsubscribe$).subscribe((funnel: EventFunnel | CustomServerError) => {
      if (funnel instanceof CustomServerError) {
        this.serverError = funnel;
        this.funnel = null;
        return;
      }

      this.serverError = null;
      this.funnel = funnel;

      if (this.chart && this.funnel) {
        this.redrawChartData();
      }
    });

    eventFunnelStream.takeUntil(this.unsubscribe$).subscribe((funnelTimeseries: EventFunnelTimeseries | CustomServerError) => {
      if (funnelTimeseries instanceof CustomServerError) {
        this.serverError = funnelTimeseries;
        this.funnelTimeseries = null;
        return;
      }

      this.serverError = null;
      this.funnelTimeseries = funnelTimeseries;

      if (this.chart && this.funnelTimeseries) {
        this.redrawChartData();
      }
    });

    Observable.timer(300).takeUntil(this.unsubscribe$).subscribe(() => {
      this.showEventOptions = true;
      this.redrawChartData();
    });

    this.start = moment().subtract(this.numberOfDays, 'd');
    this.end = moment();
    this.eventType = 'click';
    this.shouldFetch = true;
    this.showChart = true;
  }

  ngOnDestroy() {
    this.destroy();
  }

  refresh(): void {
    this.shouldFetch = true;
    this.serverError = null;
    this.fetch();
  }

  fetch(): void {
    if (this.shouldFetch) {
      this.start = moment().subtract(this.numberOfDays, 'd');

      let params = {
        start: this.start.format(),
        end: this.end.format(),
        eventType: this.eventType,
        period: this.period
      };

      this.simpleChart ? this.analyticsService.getEventFunnelSimple(params) : this.analyticsService.getEventFunnel(params);
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    let params = {
      start: this.start.format(),
      end: this.end.format(),
      downloadFormat: format
    };

    this.simpleChart ? this.analyticsService.getEventFunnelSimple(params) : this.analyticsService.getEventFunnel(params);
  }

  saveChart(chartInstance): void {
    this.chart = chartInstance;

    if (this.funnel) {
      this.redrawChartData();
    }
  }

  changeEventType(eventType) {
    this.eventType = eventType;
    this.refresh();
  }

  changeNumberOfDays(number) {
    this.numberOfDays = number;
    this.refresh();
  }

  redrawChartData(): void {

    if (!this.chart || !this.funnelTimeseries || this.funnelTimeseries.datetime.length === 0) return;

    if (!this.simpleChart) {
      this.chartOptions.chart.height = 280;
      this.chartOptions.chart['width'] = 700;
    }

    let data = [];
    this.startDate = this.funnelTimeseries.datetime[0];

    for (let i = 0; i < this.funnelTimeseries.datetime.length; i++) {
      data.push({
        y: this.funnelTimeseries.count[i]
      });
    }

    const chartLineColor = '#1EBEA5';

    this.chart.series[0].update({
      color: chartLineColor,
      pointStart: moment(this.startDate)
    });

    this.chart.series[0].setData(data, true, true);
  }

  drawMatSpinner(): boolean {
    return (this.showEventOptions && !this.showChart) || (!this.showEventOptions && !this.funnel);
  }

  drawGraph(): boolean {
    return this.showChart && this.showEventOptions;
  }

  drawTable(): boolean {
    return this.funnel && !this.showEventOptions;
  }
}
