import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {EventFunnel} from '../../../shared/models/event-funnel.model';
import {EventFunnelTimeseries} from "../../../shared/models/event-funnel-timeseries.model";
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {utc} from 'moment';

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

  colors = ['#4383CC', '#4DABF5', '#9ADDFB', '#FDAB31', '#F28933'];

  chart;
  funnel: EventFunnel;
  funnelTimeseries : EventFunnelTimeseries;

  chartOptions =  {
    chart: {
      type: 'line',
      backgroundColor: '#F4F4F4',
      height: 280
    },
    title: { text: null },
    credits: { enabled: false },
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
        lineWidth: 6
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
  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    let amount = 30;

    this.analyticsService.eventFunnelSimple$.takeUntil(this.unsubscribe$).subscribe((funnel: EventFunnel | CustomServerError) => {
      if (funnel instanceof CustomServerError) {
        this.serverError = funnel;
        this.funnel = null;
        return;
      }

      this.serverError = null;
      this.funnel = funnel;

      if (this.simpleChart) {
        amount = 1;
        this.setSimpleChartOptions();
      }

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

    this.start = utc().subtract(amount, 'd');
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

  redrawChartData(): void {

    if (!this.chart || !this.funnelTimeseries || this.funnelTimeseries.datetime.length === 0) return;

    let data = [];

    for (let i = 0; i < this.funnelTimeseries.datetime.length; i++) {
      data.push({
        y: this.funnelTimeseries.count[i]
      });
    }

    let chartLineColor = this.simpleChart ? '#12AEF9' : '#1ebea5';

    this.chart.series[0].update({
      color: chartLineColor
    });

    this.chart.series[0].setData(data, true, true);
  }

  setSimpleChartOptions() {
    this.chartOptions.chart.type = 'column';
    this.chartOptions.chart.backgroundColor = '#fafafa';
    this.chartOptions.chart.height = 240;
    this.chartOptions.chart['width'] = 350;
  }
}
