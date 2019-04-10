import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantAnalytics} from '../../shared/models/analytics/merchant-analytics.model';
import {Router} from '@angular/router';
import {AbstractEntityReportIndexComponent} from '../../pages/abstract-entity-report-index.component';
import {BreadcrumbItem} from '../../pages/components/models/breadcrumb-item.model';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MatDialog} from '@angular/material';
import {AnalyticsService} from '../../shared/services/analytics.service';
import {utc} from 'moment';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {downloadJSON, downloadCSV} from '../../shared/utils/file.utils';
import {ColumnParams} from '../../shared/models/column-params.model';

@Component({
  selector: 'merchant-report',
  templateUrl: './merchant-report.component.html',
  styleUrls: ['./merchant-report.component.scss']
})
export class MerchantReportComponent extends AbstractEntityReportIndexComponent<MerchantAnalytics> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Merchants Report', url: '/reports/merchant'}];

  sub: Subscription;

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
    private analyticsService: AnalyticsService
  ) {
    super(auth, dialog, router);

    this.columnParams = [
      new ColumnParams('Merchant Provider', (e: MerchantAnalytics) => e.gateway).setSortName('gateway'),
      new ColumnParams('Sales Count', (e: MerchantAnalytics) => e.sales).setSortName('sales'),
      new ColumnParams('Sales Gross Revenue', (e: MerchantAnalytics) => e.salesRevenue.usd()).setSortName('sales_revenue'),
      new ColumnParams('Refund Expenses', (e: MerchantAnalytics) => e.totalRefundExpense.usd()).setSortName('total_refund_expense'),
      new ColumnParams('Refund Count', (e: MerchantAnalytics) => e.partialRefunds + e.fullRefunds).setSortName('partial_refunds'),
      new ColumnParams('Declines', (e: MerchantAnalytics) => e.declines).setSortName('declines'),
      new ColumnParams('Chargebacks', (e: MerchantAnalytics) => e.chargebacks).setSortName('chargebacks'),
      new ColumnParams('Net Revenue', (e: MerchantAnalytics) => e.adjustedSalesRevenue.usd()).setSortName('adjusted_sales_revenue'),
    ];

    this.date = {start: utc().subtract(1,'M'), end: utc()};

    this.tabs = [];

  }

  ngOnInit() {
    this.fetch();
  }

  ngOnDestroy() {
    this.destroy();
  }

  private parseMerchantsForDownload(merchants: MerchantAnalytics[]): any {
    return merchants.map(m => {
      return {
        'Gateway': m.gateway,
        'Provider Type': m.providerType,
        'Currency': m.currency,
        'Monthly Cap': m.monthlyCap,
        'Gros Orders': m.grossOrders,
        'Sales': m.sales,
        'Sales Percentage': m.salesPercentage,
        'Sales Revenue': m.salesRevenue.usd(),
        'Declines': m.declines,
        'Declines Percentage': m.declinePercentage,
        'Chargebacks': m.chargebacks,
        'Chargeback Expenses': m.chargebackExpense.usd(),
        'Chargeback Percentage': m.chargebackPercentage,
        'Full Refunds': m.fullRefunds,
        'Full Refunds Expenses': m.fullRefundExpense.usd(),
        'Full Refunds Percentage': m.fullRefundPercentage,
        'Partial Refunds': m.partialRefunds,
        'Partial Refunds Expenses': m.partialRefundExpense.usd(),
        'Partial Refunds Percentage': m.partialRefundPercentage,
        'Total Refund Expenses': m.totalRefundExpense.usd(),
        'Adjusted Sales Revenue': m.adjustedSalesRevenue.usd()
      };
    });
  }

  download(format: 'csv' | 'json') {
    if (format !== 'csv' && format !== 'json') return;

    this.analyticsService.getMerchants(this.getFetchParams(true)).subscribe(merchants => {
      if (!merchants || merchants instanceof CustomServerError) {
        return;
      }

      const parsedMerchants = this.parseMerchantsForDownload(merchants);

      if (format === 'csv') {
        parsedMerchants = this.cleanEntitiesForDownload(parsedMerchants);
      }

      const fileName = this.getDownloadReportFileName('Merchants');

      if (format === 'json') {
        downloadJSON(parsedMerchants, fileName);
      } else {
        downloadCSV(parsedMerchants, fileName);
      }
    });

  }

  fetch() {
    this.loadingData = true;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.analyticsService.getMerchants(this.getFetchParams()).subscribe(merchants => {
      this.loadingData = false;

      if (!merchants || merchants instanceof CustomServerError) {
        this.entities = [];
        return;
      }

      this.entities = [...this.entities, ...merchants];
      this.hasMore = merchants.length === this.limit;
    });
  }

}
