import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractDashboardItem} from "../abstract-dashboard-item.component";
import {AnalyticsService} from "../../../shared/services/analytics.service";
import {CustomServerError} from "../../../shared/models/errors/custom-server-error";
import {SubscriptionStats} from "../../../shared/models/subscription-stats.model";
import {utc} from 'moment';

@Component({
  selector: 'top-subscriptions',
  templateUrl: './top-subscriptions.component.html',
  styleUrls: ['./top-subscriptions.component.scss']
})
export class TopSubscriptionsComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  colors = ['rgba(30, 190, 165, 1)', 'rgba(30, 190, 165, 0.8)', 'rgba(30, 190, 165, 0.6)', 'rgba(30, 190, 165, 0.4)', 'rgba(30, 190, 165, 0.2)'];

  subscriptions: SubscriptionStats[] = [];

  chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: 280,
      width: 280,
      backgroundColor: '#F4F4F4'
    },
    title: { text: null },
    credits: { enabled: false },
    tooltip: {
      formatter: function () {
        if (!this.key) return false;

        return `${this.key} \$${this.y.toLocaleString()}`
      }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false
        }
      }
    },
    series: [{
      type: 'pie',
      innerSize: '86%',
      data: [
        {name: '', y: 40, color: '#C3C3C3'},
        {name: '', y: 25, color: '#CBCBCB'},
        {name: '', y: 15, color: '#D8D8D8'},
        {name: '', y: 12, color: '#ECECEC'},
        {name: '', y: 8, color: '#E2E2E2'}
      ]
    }]
  };

  private chartInstance: any;

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.subscriptionsByAmount$.takeUntil(this.unsubscribe$).subscribe(subscriptions => {
      if (subscriptions instanceof CustomServerError) {
        this.serverError = subscriptions;
        this.subscriptions = null;
        return;
      }

      this.serverError = null;
      this.subscriptions = subscriptions;
      this.updateChart();
    });

    this.start = utc().subtract(30, 'd');
    this.end = utc();
    this.shouldFetch = true;
  }

  ngOnDestroy() {
    this.destroy();
  }

  refreshData() {
    this.shouldFetch = true;
    this.serverError = null;
    this.fetch();
  }

  fetch(): void {
    if (this.shouldFetch) {
      this.analyticsService.getSubscriptionsByAmount(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getSubscriptionsByAmount(this.start.format(), this.end.format(), format);
  }

  loadChart(chartInstance) {
    this.chartInstance = chartInstance;
    this.updateChart();
  }

  updateChart() {
    if (!this.chartInstance || !this.subscriptions || this.subscriptions.length === 0) return;

    let data = [];

    for (let i = 0; i < this.subscriptions.length; i++) {
      data.push({
        name: this.subscriptions[i].subscription,
        y: this.subscriptions[i].amount.amount,
        color: this.colors[i]
      })
    }

    this.chartInstance.chart.series[0].setData(data, true, true);
  }

}
