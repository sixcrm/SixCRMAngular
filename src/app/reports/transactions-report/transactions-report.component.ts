import {Component, OnInit, OnDestroy} from '@angular/core';
import {TransactionReportService} from '../../shared/services/analytics/transaction-report.service';
import {TransactionReport} from '../../shared/models/analytics/transaction-report.model';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {utc, Moment} from 'moment';
import {ColumnParams} from '../../shared/models/column-params.model';
import {ReportsAbstractComponent} from '../reports-abstract.component';
import {PaginationService} from '../../shared/services/pagination.service';
import {Router} from '@angular/router';
import {DateMap, FilterTerm} from '../../pages/dashboard-page/dashboard.component';

@Component({
  selector: 'transactions-report',
  templateUrl: './transactions-report.component.html',
  styleUrls: ['./transactions-report.component.scss']
})
export class TransactionsReportComponent extends ReportsAbstractComponent<TransactionReport> implements OnInit, OnDestroy {

  start: Moment = utc().subtract(3, 'M');
  end: Moment = utc();
  filterTerms: FilterTerm[] = [];
  immutableFilterTerms: FilterTerm[] = [];

  dateMap: DateMap = {start: this.start, end: this.end};

  constructor(
    private reportService: TransactionReportService,
    private progressBarService: ProgressBarService,
    paginationService: PaginationService,
    private router: Router
  ) {
    super(paginationService);

    this.fetchFunction = () => {
      this.progressBarService.showTopProgressBar();
      this.reportService.getTransactions(this.start.format(), this.end.format(), this.limit + 1, this.page * this.limit);
    }
  }

  ngOnInit() {
    this.columnParams = [
      new ColumnParams('Date', (e: TransactionReport) => e.date.format('MM/DD/YYYY')),
      new ColumnParams('Amount', (e: TransactionReport) => e.amount.usd()),
      new ColumnParams('Processor Result', (e: TransactionReport) => e.processorResult),
      new ColumnParams('Transaction Type', (e: TransactionReport) => e.transactionType),
      new ColumnParams('Transaction Subtype', (e: TransactionReport) => e.transactionSubtype)
    ];

    this.reportService.transactions$.takeUntil(this.unsubscribe$).subscribe(reports => {
      this.progressBarService.hideTopProgressBar();
      this.reports = [...this.reports, ...reports];

      if (this.reports.length < this.limit + 1) {
        this.hasMore = false;
      }

      this.reshuffle();
    });

    this.fetchFunction();
  }

  ngOnDestroy() {
    this.destroy();
  }

  dateChanged(date: DateMap): void {
    this.start = date.start;
    this.end = date.end;

    this.dateMap = {start: this.start, end: this.end};
  }

  groupByChanged(groupBy: string): void {

  }

  addFilter(filter: FilterTerm): void {
    this.filterTerms.push(filter);
    this.immutableFilterTerms = this.filterTerms.slice();
  }

  removeFilter(filter: FilterTerm): void {
    let index = this.getFilterTermIndex(filter);

    if (index !== -1) {
      this.filterTerms.splice(index,1);
    }

    this.immutableFilterTerms = this.filterTerms.slice();
  }

  reset(): void {
    this.start = utc().subtract(3, 'M');
    this.end = utc();
    this.filterTerms = [];
    this.immutableFilterTerms = this.filterTerms.slice();
    this.dateMap = {start: this.start, end: this.end};
  }

  refresh(): void {
    this.reset();

    this.fetchFunction();
  }

  private getFilterTermIndex(filterTerm: FilterTerm): number {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (filterTerm.id === this.filterTerms[i].id)
        return i;
    }

    return -1;
  }

  navigate(report: TransactionReport): void {
    this.router.navigate(['transactions', report.id]);
  }
}
