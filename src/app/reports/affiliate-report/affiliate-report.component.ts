import {Component, OnInit, OnDestroy} from '@angular/core';
import {AffiliateAnalytics} from '../../shared/models/analytics/affiliate-analytics.model';
import {Router} from '@angular/router';
import {ReportColumnParams} from '../components/report-table/report-table.component';
import {Subscription} from 'rxjs';
import {BreadcrumbItem} from '../../pages/components/models/breadcrumb-item.model';
import {AbstractEntityReportIndexComponent} from '../../pages/abstract-entity-report-index.component';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AnalyticsService} from '../../shared/services/analytics.service';
import {utc} from 'moment';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {downloadJSON, downloadCSV} from '../../shared/utils/file.utils';

@Component({
  selector: 'affiliate-report',
  templateUrl: './affiliate-report.component.html',
  styleUrls: ['./affiliate-report.component.scss']
})
export class AffiliateReportComponent extends AbstractEntityReportIndexComponent<AffiliateAnalytics> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Affiliates Report', url: '/reports/affiliate'}];

  sub: Subscription;

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
    private analyticsService: AnalyticsService
  ) {
    super(auth, dialog, router);

    this.columnParams = [
      new ReportColumnParams('Affiliate', (e: AffiliateAnalytics) => e.affiliate || '–').setSortName('affiliate'),
      new ReportColumnParams('Clicks', (e: AffiliateAnalytics) => e.clicks).setSortName('clicks'),
      new ReportColumnParams('Partials Count', (e: AffiliateAnalytics) => e.partials).setSortName('partials'),
      new ReportColumnParams('Partials Percentage', (e: AffiliateAnalytics) => e.partialsPercent.toFixed(2) + '%',).setSortName('partials_percentage'),
      new ReportColumnParams('Declines Count', (e: AffiliateAnalytics) => e.declines).setSortName('declines'),
      new ReportColumnParams('Declines Percentage', (e: AffiliateAnalytics) => e.declinesPercentage.toFixed(2) + '%').setSortName('declines_percentage'),
      new ReportColumnParams('Sales Count', (e: AffiliateAnalytics) => e.sales).setSortName('sales'),
      new ReportColumnParams('Sales Percentage', (e: AffiliateAnalytics) => e.salesPercent.toFixed(2) + '%').setSortName('sales_percentage'),
      new ReportColumnParams('Upsell Count', (e: AffiliateAnalytics) => e.upsells).setSortName('upsells'),
      new ReportColumnParams('Upsell Percentage', (e: AffiliateAnalytics) => e.upsellPercentage.toFixed(2) + '%').setSortName('upsells_percentage'),
      new ReportColumnParams('Upsell Sum', (e: AffiliateAnalytics) => e.upsellRevenue.usd()).setSortName('upsells_revenue'),
      new ReportColumnParams('Total Amount', (e: AffiliateAnalytics) => e.salesRevenue.usd()).setSortName('sales_revenue')
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

  private parseAffiliatesForDownload(affiliates: AffiliateAnalytics[]): any {
    return affiliates.map(a => {
      return {
        'Affiliate': a.affiliate,
        'Clicks': a.clicks,
        'Partials': a.partials,
        'Partials Percentage': a.partialsPercent,
        'Gross Orders': a.grossOrders,
        'Gross Orders Percentage': a.grossOrdersPercentage,
        'Sales': a.sales,
        'Sales Percentage': a.salesPercent,
        'Sales Revenue': a.salesRevenue.usd(),
        'Upsells': a.upsells,
        'Upsell Percentage': a.upsellPercentage,
        'Upsell Revenue': a.upsellRevenue.usd(),
        'Blended Sales': a.blendedSales,
        'Blended Sales Revenue': a.blendedSalesRevenue.usd(),
        'AOV': a.aov,
        'Declines': a.declines,
        'Declines Percentage': a.declinesPercentage
      };
    });
  }

  download(format: 'csv' | 'json') {
    if (format !== 'csv' && format !== 'json') return;

    this.analyticsService.getAffiliates({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(affiliates => {
      if (!affiliates || affiliates instanceof CustomServerError) {
        return;
      }

      const parsedAffiliates = this.parseAffiliatesForDownload(affiliates);

      const fileName = `${this.authService.getActiveAccount().name} Affiliates ${utc().tz(this.authService.getTimezone()).format('MM-DD-YY')}`;

      if (format === 'json') {
        downloadJSON(parsedAffiliates, fileName);
      } else {
        downloadCSV(parsedAffiliates, fileName);
      }
    });

  }

  fetch() {
    this.loadingData = true;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.analyticsService.getAffiliates({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      limit: 25,
      offset: this.entities.length,
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(affiliates => {
      this.loadingData = false;

      if (!affiliates || affiliates instanceof CustomServerError) {
        this.entities = [];
        return;
      }

      this.entities = [...this.entities, ...affiliates];
      this.hasMore = affiliates.length === this.limit;
    });
  }
}
