import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import {EventFunnel} from '../../../shared/models/event-funnel.model';
import {EventFunnelTimeseries} from "../../../shared/models/event-funnel-timeseries.model";
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {utc} from 'moment';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'funnel-graph-simple',
  templateUrl: './funnel-graph-simple.component.html',
  styleUrls: ['./funnel-graph-simple.component.scss']
})
export class FunnelGraphSimpleComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  public eventType: 'click' | 'lead' | 'main' | 'upsell' | 'confirm';
  @Input() simpleChart: boolean = false;
  @Input() period: string = 'DAY';
  showChart: boolean;
  showStatisticDetails: boolean = false;
  numberOfDays: number = 30;

  colors = ['#4383CC', '#4DABF5', '#9ADDFB', '#FDAB31', '#F28933'];

  chart;
  funnel: EventFunnel;
  funnelTimeseries : EventFunnelTimeseries;

  chartOptions =  {
    chart: {
      type: 'column',
      backgroundColor: '#FAFAFA',
      height: 370,
      width: 700
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
        pointStart: utc().subtract(this.numberOfDays, 'd'),
        pointInterval: this.determinePointInterval()
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
    this.analyticsService.eventFunnelSimple$.takeUntil(this.unsubscribe$).subscribe((funnel: EventFunnel | CustomServerError) => {
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

    this.analyticsService.eventFunnelTimeseriesSimple$.takeUntil(this.unsubscribe$).subscribe((funnelTimeseries: EventFunnelTimeseries | CustomServerError) => {
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
      this.showStatisticDetails = true;
      this.redrawChartData();
    });

    this.start = utc().subtract(this.numberOfDays, 'd');
    this.end = utc();
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
      this.start = utc().subtract(this.numberOfDays, 'd');
      this.analyticsService.getEventFunnelSimple(this.start.format(), this.end.format(), null, this.eventType, this.period);
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getEventFunnelSimple(this.start.format(), this.end.format(), format);
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
    this.period = this.determinePeriod();
    this.refresh();
  }

  determinePeriod() {
    if (this.numberOfDays > 7) {
      return 'DAY'
    } else {
      return 'HOUR'
    }
  }

  determinePointInterval() {
    const hour =  3600 * 1000;
    if (this.period === 'HOUR') {
      return hour;
    }
    if (this.period === 'DAY') {
      return hour * 24;
    }
  }

  redrawChartData(): void {

    if (!this.chart || !this.funnelTimeseries || this.funnelTimeseries.datetime.length === 0) return;

    let data = [];

    for (let i = 0; i < this.funnelTimeseries.datetime.length; i++) {
      data.push({
        y: this.funnelTimeseries.count[i]
      });
    }

    const chartLineColor = '#1EBEA5';

    this.chart.series[0].update({
      color: chartLineColor,
      pointStart: utc().subtract(this.numberOfDays, 'd'),
      pointInterval: this.determinePointInterval()
    });

    this.chart.series[0].setData(data, true, true);
  }
}
