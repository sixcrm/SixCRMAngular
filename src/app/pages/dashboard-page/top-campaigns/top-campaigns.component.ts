import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {CampaignStats} from '../../../shared/models/campaign-stats.model';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {utc} from 'moment';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'top-campaigns',
  templateUrl: './top-campaigns.component.html',
  styleUrls: ['./top-campaigns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopCampaignsComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  colors = ['rgba(30, 190, 165, 1)', 'rgba(30, 190, 165, 0.8)', 'rgba(30, 190, 165, 0.6)', 'rgba(30, 190, 165, 0.4)', 'rgba(30, 190, 165, 0.2)'];

  campaigns: CampaignStats[];

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

  chartVisible: boolean = false;

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.campaignsByAmount$.takeUntil(this.unsubscribe$).subscribe(campaigns => {
      if (campaigns instanceof CustomServerError) {
        this.serverError = campaigns;
        this.campaigns = null;
        return;
      }

      this.serverError = null;
      this.campaigns = campaigns;
      this.updateChart();
    });

    let chartUpdateSubscription = Observable.timer(300, 1000).takeUntil(this.unsubscribe$).subscribe(() => {
      if (this.campaigns) {
        this.chartVisible = true;
      }

      if (this.campaigns && this.chartInstance) {
        this.updateChart();
        chartUpdateSubscription.unsubscribe();
      }
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
      this.analyticsService.getCampaignsByAmount(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getCampaignsByAmount(this.start.format(), this.end.format(), format);
  }

  loadChart(chartInstance) {
    this.chartInstance = chartInstance;
    this.updateChart();
  }

  updateChart() {
    if (!this.chartInstance || !this.campaigns || this.campaigns.length === 0) return;

    let data = [];

    for (let i = 0; i < this.campaigns.length; i++) {
      data.push({
        name: this.campaigns[i].campaign,
        y: this.campaigns[i].amount.amount,
        color: this.colors[i]
      })
    }

    this.chartInstance.chart.series[0].setData(data, true, true);
  }
}
