import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {AnalyticsService} from '../../../../shared/services/analytics.service';
import {TransactionSummary} from '../../../../shared/models/transaction-summary.model';
import {utc} from 'moment';
import {Subscription} from 'rxjs';
import {flatDown, flatUp} from '../../../../shared/components/advanced-filter/advanced-filter.component';

@Component({
  selector: 'account-management-billing-transactions-chart',
  templateUrl: './account-management-billing-transactions-chart.component.html',
  styleUrls: ['./account-management-billing-transactions-chart.component.scss'],
  host: { '(window:resize)': 'resizeChart()' }
})
export class AccountManagementBillingTransactionsChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer;

  summaries: TransactionSummary[];
  summariesSub: Subscription;

  chartOptions = {
    chart: {
      type: 'column',
      backgroundColor: 'rgba(0,0,0,0)',
      height: '40%',
      width: 800
    },
    title: { text: null },
    credits: { enabled: false },
    xAxis: {
      type: 'datetime',
      labels: {
        step: 3,
        style : {
          color: '#999999'
        }
      }
    },
    yAxis: {
      title: { enabled: false },
      labels: {
        step: 1,
        style : {
          color: '#999999'
        }
      },
      gridLineColor: '#000000'
    },
    legend: { enabled: false },
    plotOptions: {
      line: {
        fillOpacity: 1,
        marker: { enabled: false }
      }
    },
    series: [
      {
        color: '#999999',
        name: 'transactions',
        data: [3, 3, 5, 4, 6, 8, 6, 9, 10, 9, 10, 3, 3, 5, 4, 6, 8, 6, 9, 10, 9, 10, 3, 3, 5, 4, 6, 8, 6, 9, 10],
        pointStart: utc().subtract(30, 'd'),
        pointInterval: 24 * 3600 * 1000 // one day
      }
    ]
  };

  chartInstance;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.summariesSub = this.analyticsService.transactionsSummaries$.subscribe(summaries => {
      if (summaries) {
        if (summaries instanceof CustomServerError) {
          return;
        }

        this.summaries = summaries;
        this.redrawChartData();
      }
    });

    this.analyticsService.getTransactionSummaries(flatDown(utc().subtract(30, 'd')).format(), flatUp(utc()).format(), []);
  }

  ngOnDestroy() {
    if (this.summariesSub) {
      this.summariesSub.unsubscribe();
    }
  }

  saveChart(instance) {
    this.chartInstance = instance;

    this.resizeChart();
    this.redrawChartData();
  }

  resizeChart() {
    if (!this.chartContainer || !this.chartContainer.nativeElement) return;

    this.chartInstance.setSize(this.chartContainer.nativeElement.offsetWidth, (this.chartContainer.nativeElement.offsetWidth / 10) * 3.5);
  }

  redrawChartData(): void {
    if (!this.chartInstance || !this.summaries) return;

    let data = [];

    this.summaries.forEach(summary => {
      const result = summary.results.filter(r => r.processorResult === 'success')[0].count;
      data.push([summary.time.valueOf(), result])
    });

    this.chartInstance.series[0].update({
      color: '#1EB1FC'
    });

    this.chartInstance.series[0].setData(data, true, true);
  }

}
