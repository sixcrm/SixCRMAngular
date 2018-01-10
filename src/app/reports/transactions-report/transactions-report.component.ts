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
  selector: 'transactions-report',
  templateUrl: './transactions-report.component.html',
  styleUrls: ['./transactions-report.component.scss']
})
export class TransactionsReportComponent extends ReportsAbstractComponent<TransactionReport> implements OnInit, OnDestroy {

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
      this.reportService.getTransactions(this.start.format(), this.end.format(), this.filterTerms, false, this.limit + 1, this.page * this.limit);
      this.reportService.getTransactionsSumTotal(this.start.format(), this.end.format(), this.filterTerms);
    };

    this.endpointExtension = 'transaction';

    super.init();

    this.columnParamsTotal = [
      new ReportColumnParams('SUMMARYREPORT_SALES', (e: TransactionsSumItem) => e.saleCount, 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_SALESREVENUE', (e: TransactionsSumItem) => new Currency(e.saleRevenue).usd(), 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_REBILL', (e: TransactionsSumItem) => e.rebillCount, 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_REBILLREVENUE', (e: TransactionsSumItem) => new Currency(e.rebillRevenue).usd(), 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_REFUNDS', (e: TransactionsSumItem) => e.refundCount, 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_REFUNDEXPENSES', (e: TransactionsSumItem) => '-' + new Currency(e.refundExpenses).usd(), 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_DECLINES', (e: TransactionsSumItem) => e.declinesCount, 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_DECLINESREVENUE', (e: TransactionsSumItem) => new Currency(e.declinesRevenue).usd(), 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_GROSSREVENUE', (e: TransactionsSumItem) => new Currency(e.grossRevenue).usd(), 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_CHARGEBACKS', (e: TransactionsSumItem) => e.chargebackCount, 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_ALERTS', (e: TransactionsSumItem) => e.countAlertCount, 'right').setNumberOption(true),
      new ReportColumnParams('SUMMARYREPORT_ACTIVECUSTOMERS', (e: TransactionsSumItem) => e.currentActiveCustomer, 'right').setNumberOption(true),
    ];

    const f = this.authService.getTimezone();

    this.columnParams = [
      new ReportColumnParams('SUMMARYREPORT_DATE', (e: TransactionReport) => e.date.tz(f).format('MM/DD/YY [at] hh:mm')),
      new ReportColumnParams('TRANSACTIONREPORT_CUSTOMER', (e: TransactionReport) => `${e.customer.firstName} ${e.customer.lastName}`),
      new ReportColumnParams('TRANSACTIONREPORT_CAMPAIGN', (e: TransactionReport) => e.campaign.name),
      new ReportColumnParams('TRANSACTIONREPORT_MERCHANTPROVIDER', (e: TransactionReport) => e.merchantProvider.name),
      new ReportColumnParams('TRANSACTIONREPORT_AFFILIATE', (e: TransactionReport) => e.affiliate.name),
      new ReportColumnParams('TRANSACTIONREPORT_AMOUNT', (e: TransactionReport) => e.amount.usd(), 'right').setNumberOption(true),
      new ReportColumnParams('TRANSACTIONREPORT_PROCESSORRESULT', (e: TransactionReport) => e.processorResult),
      new ReportColumnParams('TRANSACTIONREPORT_TRANSACTIONTYPE', (e: TransactionReport) => e.transactionType),
    ];

    this.reportService.transactions$.takeUntil(this.unsubscribe$).subscribe(reports => {
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
    this.reportService.getTransactions(this.start.format(), this.end.format(), this.filterTerms, true, this.limit + 1, this.page * this.limit)
  }

}
