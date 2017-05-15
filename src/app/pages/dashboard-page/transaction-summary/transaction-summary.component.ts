import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {TransactionSummary} from '../../../shared/models/transaction-summary.model';

@Component({
  selector: 'transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryComponent implements OnInit, OnDestroy {

  @Input() set transactionSummaries(summaries: TransactionSummary[]) {
    if (summaries) {
      this.summaries = summaries;

      if (this.chartInstance) {
        this.redrawChart();
      }
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

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.chartInstance = null;
  }

  saveChart(chartInstance): void {
    this.chartInstance = chartInstance;

    if (this.summaries) {
      this.redrawChart();
    }
  }

  private redrawChart(): void {
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
