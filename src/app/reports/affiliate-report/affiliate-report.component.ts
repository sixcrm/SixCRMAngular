import {Component, OnInit, OnDestroy} from '@angular/core';
import {AffiliateReport} from '../../shared/models/analytics/affiliate-report.model';
import {ReportsAbstractComponent} from '../reports-abstract.component';
import {AffiliateReportService} from '../../shared/services/analytics/affiliate-report.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {ActivatedRoute} from '@angular/router';
import {flatDown, flatUp} from '../../shared/components/advanced-filter/advanced-filter.component';
import {ReportColumnParams} from '../components/report-table/report-table.component';

@Component({
  selector: 'affiliate-report',
  templateUrl: './affiliate-report.component.html',
  styleUrls: ['./affiliate-report.component.scss']
})
export class AffiliateReportComponent  extends ReportsAbstractComponent<AffiliateReport> implements OnInit, OnDestroy {

  columnParamsTotal: ReportColumnParams<AffiliateReport>[] = [];
  reportsTotal: AffiliateReport[] = [];

  constructor(
    public affiliateReportService: AffiliateReportService,
    paginationService: PaginationService,
    route: ActivatedRoute,
  ) {
    super(route, paginationService);
  }

  ngOnInit() {
    this.fetchFunction = () => {
      this.immutableFilterTerms = this.filterTerms.slice();
      this.dateMap = {start: flatDown(this.start), end: flatUp(this.end)};
      this.affiliateReportService.getAffiliatesReport(this.start.format(), this.end.format(), this.filterTerms, false, this.limit + 1, this.page * this.limit);
      this.affiliateReportService.getAffiliatesSummary(this.start.format(), this.end.format(), this.filterTerms);
    };

    this.endpointExtension = 'affiliate';

    super.init();

    this.columnParamsTotal = [
      new ReportColumnParams('Clicks count', (e: AffiliateReport) => e.countClick, 'right'),
      new ReportColumnParams('Partials Count', (e: AffiliateReport) => e.countPartials, 'right'),
      new ReportColumnParams('Partials Percent', (e: AffiliateReport) => e.partialsPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('Declines Count', (e: AffiliateReport) => e.declineCount, 'right'),
      new ReportColumnParams('Declines Percent', (e: AffiliateReport) => e.declinesPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('Sales Count', (e: AffiliateReport) => e.countSales, 'right'),
      new ReportColumnParams('Sales Percent', (e: AffiliateReport) => e.salesPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('Upsell Count', (e: AffiliateReport) => e.countUpsell, 'right'),
      new ReportColumnParams('Upsells Percent', (e: AffiliateReport) => e.upsellPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('Upsell Sum', (e: AffiliateReport) => e.sumUpsell.usd(), 'right'),
      new ReportColumnParams('Amount Sum', (e: AffiliateReport) => e.sumAmount.usd(), 'right'),
    ];

    this.columnParams = [
      new ReportColumnParams('Affiliate', (e: AffiliateReport) => e.affiliate.name),
      ...this.columnParamsTotal
    ];

    this.affiliateReportService.affiliates$.takeUntil(this.unsubscribe$).subscribe(reports => {
      this.reports = [...this.reports, ...reports];

      if (this.reports.length < this.limit + 1) {
        this.hasMore = false;
      }

      this.reshuffle();
    });

    this.affiliateReportService.affiliateSummary$.takeUntil(this.unsubscribe$).subscribe(reports => {
      this.reportsTotal = [reports];
    });

  }

  ngOnDestroy() {
    this.destroy();
  }

  download(format: string): void {
    this.affiliateReportService.getAffiliatesReport(this.start.format(), this.end.format(), this.filterTerms, true, this.limit + 1, this.page * this.limit)
  }
}
