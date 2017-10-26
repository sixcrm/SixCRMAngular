import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {AbstractDashboardItem} from '../../pages/dashboard-page/abstract-dashboard-item.component';
import {TransactionSummary} from '../../shared/models/transaction-summary.model';
import {AnalyticsService} from '../../shared/services/analytics.service';
import {FilterTerm, flatUp} from '../../shared/components/advanced-filter/advanced-filter.component';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';

@Component({
  selector: 'transaction-summary-chart',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryChartComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  filterTerms: FilterTerm[] = [];

  @Input() set filters(filters: FilterTerm[]) {
    this.filterTerms = filters;

    if (!this.shouldFetch && this.start && this.end) {
      this.shouldFetch = true;
    }
  }

  summaries: TransactionSummary[];
  loaded: boolean = false;

  chartInstance;
  chartOptions = {
    credits: {enabled: false},
    rangeSelector: {enabled: false},
    series: [
      { name: 'successes', color: '#F28933' },
      { name: 'declines', color: '#407CC1' },
      { name: 'errors', color: '#9ADDFB' }
    ],
    navigator: {
      maskFill: 'rgba(0,0,0,0.15)',
      handles: {
        backgroundColor: '#818181',
        borderColor: '#ffffff'
      },
      outlineColor: 'rgba(0,0,0,0)',
      series: {
        type: 'areaspline',
        color: 'rgba(0,0,0,1)',
        fillOpacity: 0.2,
        lineWidth: 1,
      }
    },
    scrollbar: {
      barBackgroundColor: 'rgba(0,0,0,0.25)',
      barBorderRadius: 10,
      barBorderColor: '#ffffff',

      buttonArrowColor: '#ffffff',
      buttonBackgroundColor: 'rgba(0,0,0,0.25)',
      buttonBorderRadius: 10,
      buttonBorderColor: '#ffffff',

      rifleColor: '#ffffff',

      trackBackgroundColor: '#ffffff',
      trackBorderColor: 'rgba(0,0,0,0.15)',
      trackBorderRadius: 10,
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: 'rgba(0,0,0,0.8)',
      style: { 'color': '#fff', 'fontSize': '14px' }
    }
  };

  loaderOptions = {
    credits: {enabled: false},
    title: {
      text: null
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        enabled: false
      }
    },
    xAxis: {
      labels: {
        enabled: false
      }
    },
    series: [
      { color: '#C3C3C3', data: [[0,1],[1,2],[2,3],[3,2],[4,1],[5,2],[6,2],[7,3],[8,2],[9,3]] },
    ]
  };

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.transactionsSummaries$.takeUntil(this.unsubscribe$).subscribe(summaries => {
      if (summaries) {
        if (summaries instanceof CustomServerError) {
          this.serverError = summaries;
          this.summaries = null;
          this.loaded = true;
          return;
        }

        this.serverError = null;
        this.summaries = summaries;
        if (this.chartInstance) {
          this.redrawChart();
        }
      }
    })
  }

  ngOnDestroy() {
    this.chartInstance = null;
    this.destroy();
  }

  refreshData() {
    this.shouldFetch = true;
    this.serverError = null;
    this.fetch();
  }

  fetch(): void {
    if (this.shouldFetch) {
      if (!this.summaries || this.summaries.length === 0) {
        this.loaded = false;
      }
      this.analyticsService.getTransactionSummaries(this.start.format(), flatUp(this.end).format(), this.filterTerms);
      this.shouldFetch = false;
    }
  }

  saveChart(chartInstance): void {
    this.chartInstance = chartInstance;

    if (this.summaries && !this.loaded) {
      this.redrawChart();
    }
  }

  download(format: string): void {
    this.analyticsService.getTransactionSummaries(this.start.format(), flatUp(this.end).format(), this.filterTerms, format);
  }

  private redrawChart(): void {
    if (!this.summaries) return;

    let data = {};

    this.summaries.forEach(summary => {
      summary.results.forEach(result => {

        if (data[result.processorResult]) {
          data[result.processorResult].push([summary.time.valueOf(), result.amount])
        } else {
          data[result.processorResult] = [[summary.time.valueOf(), result.amount]];
        }

      })
    });

    this.chartInstance.series[0].setData(data['success'], true);
    this.chartInstance.series[1].setData(data['decline'], true);
    this.chartInstance.series[2].setData(data['error'], true);

    this.loaded = true;
  }
}
