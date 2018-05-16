import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {EventFunnel} from '../../../shared/models/event-funnel.model';
import {EventFunnelTimeseries} from "../../../shared/models/event-funnel-timeseries.model";
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {utc} from 'moment';

@Component({
  selector: 'funnel-graph',
  templateUrl: './funnel-graph.component.html',
  styleUrls: ['./funnel-graph.component.scss']
})
export class FunnelGraphComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  public eventType: 'click' | 'lead' | 'main' | 'upsell' | 'confirm';
  @Input() simpleChart: boolean = false;

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
        lineWidth: 8
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
    this.analyticsService.eventFunnel$.takeUntil(this.unsubscribe$).subscribe((funnel: EventFunnel | CustomServerError) => {
      if (funnel instanceof CustomServerError) {
        this.serverError = funnel;
        this.funnel = null;
        return;
      }

      this.serverError = null;
      this.funnel = funnel;

      if (this.simpleChart) {
        this.setSimpleChartOptions();
      }

      if (this.chart && this.funnel) {
        this.redrawChartData();
      }
    });

    this.analyticsService.eventFunnelTimeseries$.takeUntil(this.unsubscribe$).subscribe((funnelTimeseries: EventFunnelTimeseries | CustomServerError) => {
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

    this.start = utc().subtract(30, 'd');
    this.end = utc();
    this.eventType = 'click';
    this.shouldFetch = true;
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
      this.analyticsService.getEventFunnel(this.start.format(), this.end.format(), null, this.eventType);
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getEventFunnel(this.start.format(), this.end.format(), format);
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

    let chartLineColor = this.simpleChart ? '#1be1fc' : '#00DC59';

    this.chart.series[0].update({
      color: chartLineColor
    });

    this.chart.series[0].setData(data, true, true);
  }

  setSimpleChartOptions() {
    this.chartOptions.chart.type = 'column';
    this.chartOptions.chart.backgroundColor = '#fafafa';
  }
}
