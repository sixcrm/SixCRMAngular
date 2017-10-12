import {Component, OnInit, OnDestroy} from '@angular/core';
import {TransactionReportService} from '../../shared/services/analytics/transaction-report.service';
import {TransactionReport} from '../../shared/models/analytics/transaction-report.model';
import {utc, Moment} from 'moment';
import {ReportsAbstractComponent, ReportColumnParams} from '../reports-abstract.component';
import {PaginationService} from '../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {FilterTerm, DateMap, flatDown, flatUp} from '../../shared/components/advanced-filter/advanced-filter.component';
import {scrollContentToTop} from '../../shared/utils/document.utils';
import {TransactionsSumItem} from '../../shared/models/analytics/transactions-sum-item.model';
import {Currency} from '../../shared/utils/currency/currency';

@Component({
  selector: 'transactions-report',
  templateUrl: './transactions-report.component.html',
  styleUrls: ['./transactions-report.component.scss']
})
export class TransactionsReportComponent extends ReportsAbstractComponent<TransactionsSumItem> implements OnInit, OnDestroy {

  start: Moment;
  end: Moment;
  filterTerms: FilterTerm[] = [];
  immutableFilterTerms: FilterTerm[] = [];
  dateMap: DateMap;
  shareUrl: string;

  constructor(
    private reportService: TransactionReportService,
    paginationService: PaginationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(paginationService);

    this.fetchFunction = () => {
      this.immutableFilterTerms = this.filterTerms.slice();
      this.dateMap = {start: flatDown(this.start), end: flatUp(this.end)};
      this.reportService.getTransactionsSum(this.start.format(), this.end.format(), this.filterTerms, false, this.limit + 1, this.page * this.limit);
    }
  }

  ngOnInit() {

    this.columnParams = [
      new ReportColumnParams('Date', (e: TransactionsSumItem) => e.period.format('MM/DD/YY')),
      new ReportColumnParams('Sales', (e: TransactionsSumItem) => e.saleCount, 'right'),
      new ReportColumnParams('Sales Revenue', (e: TransactionsSumItem) => new Currency(e.saleRevenue).usd(), 'right'),
      new ReportColumnParams('Rebill', (e: TransactionsSumItem) => e.rebillCount, 'right'),
      new ReportColumnParams('Rebill Revenue', (e: TransactionsSumItem) => new Currency(e.rebillRevenue).usd(), 'right'),
      new ReportColumnParams('Refunds', (e: TransactionsSumItem) => e.refundCount, 'right'),
      new ReportColumnParams('Refund Expanses', (e: TransactionsSumItem) => '-' + new Currency(e.refundExpenses).usd(), 'right'),
      new ReportColumnParams('Declines', (e: TransactionsSumItem) => e.declinesCount, 'right'),
      new ReportColumnParams('Declines Revenue', (e: TransactionsSumItem) => new Currency(e.declinesRevenue).usd(), 'right'),
      new ReportColumnParams('Gross Revenue', (e: TransactionsSumItem) => new Currency(e.grossRevenue).usd(), 'right'),
      new ReportColumnParams('Chargeback', (e: TransactionsSumItem) => e.chargebackCount, 'right'),
      new ReportColumnParams('Alerts', (e: TransactionsSumItem) => e.countAlertCount, 'right'),
      new ReportColumnParams('Active Customers', (e: TransactionsSumItem) => e.currentActiveCustomer, 'right'),
    ];

    this.reportService.transactionsSumItems$.takeUntil(this.unsubscribe$).subscribe(reports => {
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
      this.getShareUrl();
      this.fetchFunction();
    });
  }

  resetAndFetch() {
    this.reports = [];
    this.hasMore = true;
    this.page = 0;
    this.fetchFunction();
  }

  ngOnDestroy() {
    this.destroy();
  }

  dateChanged(date: DateMap): void {
    this.start = date.start;
    this.end = date.end;

    this.resetAndFetch();
    this.getShareUrl();
  }

  groupByChanged(groupBy: string): void {

  }

  addFilter(filter: FilterTerm): void {
    this.filterTerms.push(filter);
    this.resetAndFetch();
    this.getShareUrl();
  }

  filterSelected(filter: FilterTerm): void {
    this.addFilter(filter);
    scrollContentToTop();
  }

  removeFilter(filter: FilterTerm): void {
    let index = this.getFilterTermIndex(filter);

    if (index !== -1) {
      this.filterTerms.splice(index,1);
    }

    this.resetAndFetch();
    this.getShareUrl();
  }

  reset(): void {
    this.start = utc().subtract(3, 'M');
    this.end = utc();
    this.filterTerms = [];
    this.resetAndFetch();
    this.getShareUrl();
  }

  refresh(): void {
    this.reset();
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

  download(format: string): void {
    this.reportService.getTransactionsSum(this.start.format(), this.end.format(), this.filterTerms, true, this.limit + 1, this.page * this.limit)
  }

  viewTransaction(transaction) {
    this.router.navigate(['/transactions', transaction.id])
  }

  private getFilterTermIndex(filterTerm: FilterTerm): number {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (filterTerm.id === this.filterTerms[i].id)
        return i;
    }

    return -1;
  }
}
