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

  reportSummaryLoading: boolean = true;

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
      this.affiliateReportService.getAffiliatesSummary(this.start.format(), this.end.format(), this.filterTerms);
    };

    this.endpointExtension = 'affiliate';

    super.init();

    this.columnParamsTotal = [
      new ReportColumnParams('AFFILIATEREPORT_CLICKSCOUNT', (e: AffiliateReport) => e.countClick, 'right'),
      new ReportColumnParams('AFFILIATEREPORT_PARTIALSCOUNT', (e: AffiliateReport) => e.countPartials, 'right'),
      new ReportColumnParams('AFFILIATEREPORT_PARTIALSPERCENTAGE', (e: AffiliateReport) => e.partialsPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('AFFILIATEREPORT_DECLINESCOUNT', (e: AffiliateReport) => e.declineCount, 'right'),
      new ReportColumnParams('AFFILIATEREPORT_DECLINESPERCENTAGE', (e: AffiliateReport) => e.declinesPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('AFFILIATEREPORT_SALESCOUNT', (e: AffiliateReport) => e.countSales, 'right'),
      new ReportColumnParams('AFFILIATEREPORT_SALESPERCENTAGE', (e: AffiliateReport) => e.salesPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('AFFILIATEREPORT_UPSELLCOUNT', (e: AffiliateReport) => e.countUpsell, 'right'),
      new ReportColumnParams('AFFILIATEREPORT_UPSELLPERCENTAGE', (e: AffiliateReport) => e.upsellPercent.toFixed(2) + '%', 'right'),
      new ReportColumnParams('AFFILIATEREPORT_UPSELLSUM', (e: AffiliateReport) => e.sumUpsell.usd(), 'right'),
      new ReportColumnParams('AFFILIATEREPORT_AMOUNTSUM', (e: AffiliateReport) => e.sumAmount.usd(), 'right'),
    ];

    this.columnParams = [
      new ReportColumnParams('AFFILIATEREPORT_AFFILIATE', (e: AffiliateReport) => e.affiliate.name).setIsLink(true),
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
      this.reportSummaryLoading = false;
      this.reportsTotal = [reports];
    });

  }

  ngOnDestroy() {
    this.destroy();
  }

  download(format: string): void {
    this.affiliateReportService.getAffiliatesReport(this.start.format(), this.end.format(), this.filterTerms, true, this.limit + 1, this.page * this.limit)
  }


  clicked(event) {
    if (event.params.label === 'Affiliate') {

      const s = this.start.clone();
      const e = this.end.clone();
      const f = this.filterTerms.slice();
      Object.keys(f).forEach(key => {
        if (f[key].type === 'affiliate') {
          delete f[key];
        }
      });

      f.unshift({id: event.entity.affiliate.id, label: event.entity.affiliate.name, type: 'affiliate'});

      this.router.navigate(['/reports/subaffiliate'], {queryParams: {f: this.encodeFilters({start: s, end: e, filterTerms: f}) }})
    }
  }
}
