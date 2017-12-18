import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantReportService} from '../../shared/services/analytics/merchant-report.service';
import {MerchantReport} from '../../shared/models/analytics/merchant-report.model';
import {ReportsAbstractComponent} from '../reports-abstract.component';
import {ActivatedRoute} from '@angular/router';
import {PaginationService} from '../../shared/services/pagination.service';
import {flatUp, flatDown} from '../../shared/components/advanced-filter/advanced-filter.component';
import {ReportColumnParams} from '../components/report-table/report-table.component';

@Component({
  selector: 'merchant-report',
  templateUrl: './merchant-report.component.html',
  styleUrls: ['./merchant-report.component.scss']
})
export class MerchantReportComponent extends ReportsAbstractComponent<MerchantReport> implements OnInit, OnDestroy {

  loading: boolean = true;

  constructor(
    public merchantReportService: MerchantReportService,
    paginationService: PaginationService,
    route: ActivatedRoute,
  ) {
    super(route, paginationService);
  }

  ngOnInit() {
    this.fetchFunction = () => {
      this.immutableFilterTerms = this.filterTerms.slice();
      this.dateMap = {start: flatDown(this.start), end: flatUp(this.end)};
      this.merchantReportService.getMerchants(this.start.format(), this.end.format(), this.filterTerms, false, this.limit + 1, this.page * this.limit);
    };

    this.endpointExtension = 'merchant';

    super.init();

    this.columnParams = [
      new ReportColumnParams('MERCHANTREPORT_MERCHANTPROVIDER', (e: MerchantReport) => e.merchantProvider),
      new ReportColumnParams('MERCHANTREPORT_SALESCOUNT', (e: MerchantReport) => e.saleCount, 'right'),
      new ReportColumnParams('MERCHANTREPORT_SALESGROSSREVENUE', (e: MerchantReport) => e.saleGrossRevenue.usd(), 'right'),
      new ReportColumnParams('MERCHANTREPORT_REFUNDEXPENSES', (e: MerchantReport) => '-' + e.refundExpenses.usd(), 'right'),
      new ReportColumnParams('MERCHANTREPORT_REFUNDCOUNT', (e: MerchantReport) => e.refundCount, 'right'),
      new ReportColumnParams('MERCHANTREPORT_NETREVENUE', (e: MerchantReport) => e.netRevenue.usd(), 'right'),
      new ReportColumnParams('MERCHANTREPORT_MTDSALESCOUNT', (e: MerchantReport) => e.mtdSalesCount, 'right'),
      new ReportColumnParams('MERCHANTREPORT_MTDGROSSCOUNT', (e: MerchantReport) => e.mtdGrossCount, 'right'),
    ];

    this.merchantReportService.merchants$.takeUntil(this.unsubscribe$).subscribe(reports => {
      this.loading = false;

      this.reports = [...this.reports, ...reports];

      if (this.reports.length < this.limit + 1) {
        this.hasMore = false;
      }

      this.reshuffle();
    });

  }

  ngOnDestroy() {
    this.destroy();
  }

  download(format: string): void {
    this.merchantReportService.getMerchants(this.start.format(), this.end.format(), this.filterTerms, true, this.limit + 1, this.page * this.limit)
  }

}
