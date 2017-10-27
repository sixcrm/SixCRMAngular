import {Component, OnInit, OnDestroy} from '@angular/core';
import {TransactionReportService} from '../../shared/services/analytics/transaction-report.service';
import {TransactionReport} from '../../shared/models/analytics/transaction-report.model';
import {ReportsAbstractComponent} from '../reports-abstract.component';
import {PaginationService} from '../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {flatDown, flatUp} from '../../shared/components/advanced-filter/advanced-filter.component';
import {TransactionsSumItem} from '../../shared/models/analytics/transactions-sum-item.model';
import {Currency} from '../../shared/utils/currency/currency';
import {ReportColumnParams} from '../components/report-table/report-table.component';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent extends ReportsAbstractComponent<TransactionsSumItem> implements OnInit, OnDestroy {

  columnParamsTotal: ReportColumnParams<TransactionsSumItem>[] = [];
  reportsTotal: TransactionsSumItem[] = [];

  reportsLoading: boolean = true;
  reportsSummaryLoading: boolean = true;

  constructor(
    public reportService: TransactionReportService,
    paginationService: PaginationService,
    private router: Router,
    route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    super(route, paginationService);
  }

  ngOnInit() {
    this.fetchFunction = () => {
      this.immutableFilterTerms = this.filterTerms.slice();
      this.dateMap = {start: flatDown(this.start), end: flatUp(this.end)};
      this.reportService.getTransactionsSum(this.start.format(), this.end.format(), this.filterTerms, false, this.limit + 1, this.page * this.limit);
      this.reportService.getTransactionsSumTotal(this.start.format(), this.end.format(), this.filterTerms);
    };

    this.endpointExtension = 'summary';

    super.init();

    this.columnParamsTotal = [
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

    const f = this.authService.getTimezone();

    this.columnParams = [
      new ReportColumnParams('Date', (e: TransactionsSumItem) => e.period.tz(f).format('MM/DD/YY')).setIsLink(true),
      ...this.columnParamsTotal
    ];

    this.reportService.transactionsSumItems$.takeUntil(this.unsubscribe$).subscribe(reports => {
      this.reportsLoading = false;

      this.reports = [...this.reports, ...reports];

      if (this.reports.length < this.limit + 1) {
        this.hasMore = false;
      }

      this.reshuffle();
    });

    this.reportService.transactionsSumTotal$.takeUntil(this.unsubscribe$).subscribe(report => {
      this.reportsSummaryLoading = false;
      this.reportsTotal = [report];
    });
  }

  ngOnDestroy() {
    super.destroy();
  }

  navigate(report: TransactionReport): void {
    this.router.navigate(['transactions', report.id]);
  }

  download(format: string): void {
    this.reportService.getTransactionsSum(this.start.format(), this.end.format(), this.filterTerms, true, this.limit + 1, this.page * this.limit)
  }

  cellClicked(event: {params: ReportColumnParams<TransactionsSumItem>, entity: TransactionsSumItem}) {
    if (event.params.label === 'Date') {
      const s = event.entity.period.clone();
      const e = s.clone().add(1, 'd').subtract(1, 's');

      this.router.navigate(['/reports/transaction'], {queryParams: {f: this.encodeFilters({start: s, end: e}) }})
    }
  }
}
