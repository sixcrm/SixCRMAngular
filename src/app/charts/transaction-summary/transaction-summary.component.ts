import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {AbstractDashboardItem} from '../../pages/dashboard-page/abstract-dashboard-item.component';
import {FilterTerm, flatUp} from '../../pages/dashboard-page/dashboard.component';
import {TransactionSummary} from '../../shared/models/transaction-summary.model';
import {AnalyticsService} from '../../shared/services/analytics.service';

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
    ]
  };

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.transactionsSummaries$.takeUntil(this.unsubscribe$).subscribe(summaries => {
      if (summaries) {
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

  fetch(): void {
    if (this.shouldFetch) {
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
