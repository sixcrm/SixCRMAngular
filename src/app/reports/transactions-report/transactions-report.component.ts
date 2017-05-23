import {Component, OnInit, OnDestroy} from '@angular/core';
import {TransactionReportService} from '../../shared/services/analytics/transaction-report.service';
import {TransactionReport} from '../../shared/models/analytics/transaction-report.model';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {utc, Moment} from 'moment';
import {ColumnParams} from '../../shared/models/column-params.model';
import {ReportsAbstractComponent} from '../reports-abstract.component';
import {PaginationService} from '../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {DateMap, FilterTerm, flatUp, flatDown} from '../../pages/dashboard-page/dashboard.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'transactions-report',
  templateUrl: './transactions-report.component.html',
  styleUrls: ['./transactions-report.component.scss']
})
export class TransactionsReportComponent extends ReportsAbstractComponent<TransactionReport> implements OnInit, OnDestroy {

  start: Moment;
  end: Moment;
  filterTerms: FilterTerm[] = [];
  immutableFilterTerms: FilterTerm[] = [];
  dateMap: DateMap;
  shareUrl: string;

  constructor(
    private reportService: TransactionReportService,
    private progressBarService: ProgressBarService,
    paginationService: PaginationService,
    private router: Router,
    private route: ActivatedRoute
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
      new ColumnParams('Affiliate', (e: TransactionReport) => e.affiliate),
      new ColumnParams('Sub-Affiliate', (e: TransactionReport) => e.subAffiliate1),
      new ColumnParams('Campaign', (e: TransactionReport) => e.campaign),
      new ColumnParams('Product Schedule', (e: TransactionReport) => e.productSchedule),
      new ColumnParams('Transaction Type', (e: TransactionReport) => e.transactionType),
      new ColumnParams('Amount', (e: TransactionReport) => e.amount.usd()),
      new ColumnParams('Processor Result', (e: TransactionReport) => e.processorResult),
    ];

    this.reportService.transactions$.takeUntil(this.unsubscribe$).subscribe(reports => {
      this.progressBarService.hideTopProgressBar();
      this.reports = [...this.reports, ...reports];

      if (this.reports.length < this.limit + 1) {
        this.hasMore = false;
      }

      this.reshuffle();
    });

    this.route.queryParams.takeUntil(this.unsubscribe$).subscribe(params => {
      this.filterTerms = [];
      let data = {};

      if (params['f']) {
        data = JSON.parse(atob(params['f']));
      }

      this.extractDateFromParams(data);
      this.extractFiltersFromParams(data);

      this.immutableFilterTerms = this.filterTerms.slice();
      this.dateMap = {start: flatDown(this.start), end: flatUp(this.end)};
      this.getShareUrl();
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
    this.getShareUrl();
  }

  groupByChanged(groupBy: string): void {

  }

  addFilter(filter: FilterTerm): void {
    this.filterTerms.push(filter);
    this.immutableFilterTerms = this.filterTerms.slice();
    this.getShareUrl();
  }

  removeFilter(filter: FilterTerm): void {
    let index = this.getFilterTermIndex(filter);

    if (index !== -1) {
      this.filterTerms.splice(index,1);
    }

    this.immutableFilterTerms = this.filterTerms.slice();
    this.getShareUrl();
  }

  reset(): void {
    this.start = utc().subtract(3, 'M');
    this.end = utc();
    this.filterTerms = [];
    this.immutableFilterTerms = this.filterTerms.slice();
    this.dateMap = {start: this.start, end: this.end};
    this.getShareUrl();
  }

  refresh(): void {
    this.reset();

    this.fetchFunction();
  }

  getShareUrl(): void {
    let url = environment.auth0RedirectUrl + '/reports/transaction?f=';

    let filters = {'start': this.start.format(), 'end': this.end.format()};

    for (let i in this.filterTerms) {
      let currentFilter = this.filterTerms[i];
      let formattedFilter = {id: currentFilter.id, label: currentFilter.label};

      if (filters[currentFilter.type]) {
        filters[currentFilter.type].push(formattedFilter);
      } else {
        filters[currentFilter.type] = [formattedFilter];
      }
    }

    this.shareUrl = url + btoa(JSON.stringify(filters));
  }

  navigate(report: TransactionReport): void {
    this.router.navigate(['transactions', report.id]);
  }

  extractDateFromParams(data): void {
    if (!data['start'] || !data['end']) {
      this.start = utc().subtract(3, 'M');
      this.end = flatUp(utc());

      return;
    }

    this.start = utc(data['start']);
    this.end = flatUp(utc(data['end']));
  }

  extractFiltersFromParams(data: any): void {
    Object.keys(data).forEach(groupKey => {
      if (groupKey !== 'start' && groupKey !== 'end') {
        let group = data[groupKey];

        Object.keys(group).forEach(key => {
          this.filterTerms.push({type: groupKey, id: group[key].id, label: group[key].label})
        })
      }
    });
  }

  private getFilterTermIndex(filterTerm: FilterTerm): number {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (filterTerm.id === this.filterTerms[i].id)
        return i;
    }

    return -1;
  }
}
