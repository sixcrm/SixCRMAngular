import {Component, OnInit, OnDestroy} from '@angular/core';
import {AffiliateReport} from '../../shared/models/analytics/affiliate-report.model';
import {ReportsAbstractComponent} from '../reports-abstract.component';
import {AffiliateReportService} from '../../shared/services/analytics/affiliate-report.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {ActivatedRoute, Router} from '@angular/router';
import {flatDown, flatUp} from '../../shared/components/advanced-filter/advanced-filter.component';
import {ReportColumnParams} from '../components/report-table/report-table.component';
import {Affiliate} from '../../shared/models/affiliate.model';

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
    private router: Router
  ) {
    super(route, paginationService);
  }

  ngOnInit() {
    this.fetchFunction = () => {
      this.immutableFilterTerms = this.filterTerms.slice();
      this.dateMap = {start: flatDown(this.start), end: flatUp(this.end)};
      this.affiliateReportService.getAffiliatesReport(this.start.format(), this.end.format(), this.filterTerms, false, this.limit + 1, this.page * this.limit);
    };

    this.endpointExtension = 'affiliate';

    super.init();

    this.columnParamsTotal = [
      new ReportColumnParams('AFFILIATEREPORT_CLICKSCOUNT', (e: AffiliateReport) => e.countClick, 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_PARTIALSCOUNT', (e: AffiliateReport) => e.countPartials, 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_PARTIALSPERCENTAGE', (e: AffiliateReport) => e.partialsPercent.toFixed(2) + '%', 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_DECLINESCOUNT', (e: AffiliateReport) => e.declineCount, 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_DECLINESPERCENTAGE', (e: AffiliateReport) => e.declinesPercent.toFixed(2) + '%', 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_SALESCOUNT', (e: AffiliateReport) => e.countSales, 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_SALESPERCENTAGE', (e: AffiliateReport) => e.salesPercent.toFixed(2) + '%', 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_UPSELLCOUNT', (e: AffiliateReport) => e.countUpsell, 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_UPSELLPERCENTAGE', (e: AffiliateReport) => e.upsellPercent.toFixed(2) + '%', 'right').setNumberOption(true),
      new ReportColumnParams('AFFILIATEREPORT_UPSELLSUM', (e: AffiliateReport) => e.sumUpsell.usd(), 'right'),
      new ReportColumnParams('AFFILIATEREPORT_AMOUNTSUM', (e: AffiliateReport) => e.sumAmount.usd(), 'right'),
    ];

    this.columnParams = [
      new ReportColumnParams('AFFILIATEREPORT_AFFILIATE', (e: AffiliateReport) => e.affiliate.name || e.affiliate.affiliateId),
      ...this.columnParamsTotal
    ];

    this.affiliateReportService.affiliates$.takeUntil(this.unsubscribe$).subscribe(reports => {
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
    this.affiliateReportService.getAffiliatesReport(this.start.format(), this.end.format(), this.filterTerms, true, this.limit + 1, this.page * this.limit)
  }

  clicked(event) {
    if (event && event.entity.affiliate && event.entity.affiliate.id) {
      this.router.navigate(['/affiliates', event.entity.affiliate.id])
    }
  }
}
