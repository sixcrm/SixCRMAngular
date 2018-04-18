import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventFunnel} from '../../../shared/models/event-funnel.model';
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

  colors = ['#4383CC', '#4DABF5', '#9ADDFB', '#FDAB31', '#F28933'];

  chart;
  funnel: EventFunnel;
  showTable: boolean = true;

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
      {name: '', color: '#00DC59', data: [3, 3, 5, 4, 6, 8, 6, 9, 10, 9, 10], lineWidth: 8}
    ]
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

      if (this.chart && this.funnel) {
        this.redrawChartData();
      }
    });

    this.start = utc().subtract(30, 'd');
    this.end = utc();
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
      this.analyticsService.getEventFunnel(this.start.format(), this.end.format());
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

  redrawChartData(): void {

  }
}
