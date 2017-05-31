import {Component, OnInit, OnDestroy} from '@angular/core';
import {TransactionReportService} from '../../shared/services/analytics/transaction-report.service';
import {TransactionReport} from '../../shared/models/analytics/transaction-report.model';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {utc, Moment} from 'moment';
import {ReportsAbstractComponent, ReportColumnParams} from '../reports-abstract.component';
import {PaginationService} from '../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {FilterTerm, DateMap, flatDown, flatUp} from '../../shared/components/advanced-filter/advanced-filter.component';

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
      this.immutableFilterTerms = this.filterTerms.slice();
      this.dateMap = {start: flatDown(this.start), end: flatUp(this.end)};
      this.reportService.getTransactions(this.start.format(), this.end.format(), this.filterTerms, this.limit + 1, this.page * this.limit);
    }
  }

  ngOnInit() {
    this.columnParams = [
      new ReportColumnParams('Date', (e: TransactionReport) => e.date.format('MM/DD/YYYY')),
      new ReportColumnParams('Affiliate', (e: TransactionReport) => e.affiliate).setIsFilter(true).setEntityType('affiliate'),
      new ReportColumnParams('Sub-Affiliate', (e: TransactionReport) => e.subAffiliate1).setIsFilter(true).setEntityType('affiliate'),
      new ReportColumnParams('Campaign', (e: TransactionReport) => e.campaign).setIsFilter(true).setEntityType('campaign'),
      new ReportColumnParams('Product Schedule', (e: TransactionReport) => e.productSchedule).setIsFilter(true).setEntityType('productschedule'),
      new ReportColumnParams('Transaction Type', (e: TransactionReport) => e.transactionType),
      new ReportColumnParams('Amount', (e: TransactionReport) => e.amount.usd(), 'right'),
      new ReportColumnParams('Processor Result', (e: TransactionReport) => e.processorResult),
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

  private getFilterTermIndex(filterTerm: FilterTerm): number {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (filterTerm.id === this.filterTerms[i].id)
        return i;
    }

    return -1;
  }
}
