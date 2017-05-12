import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {utc, Moment} from 'moment';
import {SearchService} from '../../shared/services/search.service';
import {Subject} from 'rxjs';
import {TransactionSummary} from '../../shared/models/transaction-summary.model';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {DaterangepickerConfig, DaterangePickerComponent} from 'ng2-daterangepicker';
import {TransactionOverview} from '../../shared/models/transaction-overview.model';
import {AnalyticsService} from '../../shared/services/analytics.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {FunnelGraphComponent} from './funnel-graph/funnel-graph.component';

export interface FilterTerm {
  id: string;
  label: string;
  type: string;
}

interface DateFilter {
  label: string;
  start: Moment;
  end: Moment;
}


function flatDown(m: Moment) { return m.hours(0).minutes(0).seconds(0).millisecond(1) }
function flatUp(m: Moment) { return m.hours(23).minutes(59).seconds(59).millisecond(999) }
function areSame(m1: Moment, m2: Moment) { return flatDown(m1).isSame(flatDown(m2)) }

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  filterTerms: FilterTerm[] = [];
  filterSearchResults: FilterTerm[] = [];
  currentFilterTerm: string;

  dateFilters: DateFilter[] = [
    {label: '1D', start: flatDown(utc().subtract(1,'d')), end: utc()},
    {label: '1W', start: flatDown(utc().subtract(1,'w')), end: utc()},
    {label: '1M', start: flatDown(utc().subtract(1,'M')), end: utc()},
    {label: '3M', start: flatDown(utc().subtract(3,'M')), end: utc()},
    {label: '6M', start: flatDown(utc().subtract(6,'M')), end: utc()},
    {label: 'YTD', start: flatDown(utc().startOf('year')), end: utc()},
    {label: '1Y', start: flatDown(utc().subtract(1,'y')), end: utc()},
    {label: 'ALL', start: flatDown(utc().subtract(10,'y')), end: utc()},
    {label: 'CUSTOM', start: utc(), end: utc()}
  ];
  activeDateFilterIndex: number = 3;

  overviewOptions: any[] = [
    {title: 'New Sales', mapToResult: (overview: TransactionOverview) => overview.newSale, image: 'newsale.svg'},
    {title: 'Main', mapToResult: (overview: TransactionOverview) => overview.main, image: 'main.svg'},
    {title: 'Upsells', mapToResult: (overview: TransactionOverview) => overview.upsell, image: 'upsell.svg'},
    {title: 'Rebills', mapToResult: (overview: TransactionOverview) => overview.rebill, image: 'rebill.svg'},
    {title: 'Declines', mapToResult: (overview: TransactionOverview) => overview.decline, image: 'decline.svg'},
    {title: 'Errors', mapToResult: (overview: TransactionOverview) => overview.error, image: 'error.svg'}
  ];

  chart;
  chartOptions = {
    credits: {enabled: false},
    rangeSelector: {enabled: false},
    series: [
      { name: 'successes', color: '#F28933' },
      { name: 'declines', color: '#407CC1' },
      { name: 'errors', color: '#9ADDFB' }
    ]
  };
  successData = [];
  declineData = [];
  errorData = [];

  @ViewChild(DaterangePickerComponent)
  dateRangePicker: DaterangePickerComponent;
  datepickerVisible: boolean = false;

  advanced: boolean = false;
  transactionTypes: FilterTerm[] = [
    {id: 'new', label: 'New', type: 'transactiontype'},
    {id: 'rebill', label: 'Rebill', type: 'transactiontype'}
  ];
  processorResponses: FilterTerm[] = [
    {id: 'success', label: 'Success', type: 'processorresult'},
    {id: 'decline', label: 'Decline', type: 'processorresult'},
    {id: 'error', label: 'Error', type: 'processorresult'}
  ];

  private termFilterDebouncer$: Subject<boolean>;

  private unsubscribe$: Subject<boolean>;

  constructor(
    private searchService: SearchService,
    private progressBarService: ProgressBarService,
    private daterangepickerOptions: DaterangepickerConfig,
    public analyticsService: AnalyticsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.termFilterDebouncer$ = new Subject();
    this.unsubscribe$ = new Subject();
  }

  ngOnInit() {
    this.searchService.dashboardFilterResults$.takeUntil(this.unsubscribe$).subscribe(results => {
      this.filterSearchResults = this.parseFilterSearchResults(results.hit);
    });

    this.analyticsService.transactionsSummaries$.takeUntil(this.unsubscribe$).subscribe(summaries => {
      this.setTransactionSummaryChartData(summaries);
      this.progressBarService.hideTopProgressBar();
    });

    this.termFilterDebouncer$
      .takeUntil(this.unsubscribe$)
      .filter(() => !this.advanced)
      .debounceTime(500)
      .subscribe(() => {
        this.fetchTransactionSummary();
      });

    this.route.queryParams.takeUntil(this.unsubscribe$).subscribe(params => {
      this.filterTerms = [];

      if (params['f']) {
        let data = JSON.parse(atob(params['f']));

        this.extractDateFromParams(data);
        this.extractFiltersFromParams(data);
      }

      this.initDatepicker();
      this.fetchAll();
    });
  }

  initDatepicker(): void {
    this.daterangepickerOptions.settings = {
      parentEl: '.datepicker--custom',
      startDate: this.getStartDate(),
      endDate: this.getEndDate(),
      locale: { format: 'MM/DD/YYYY' },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  filterTermInput(event): void {
    this.currentFilterTerm = event.target.value;

    this.performFilterSearch();
  }

  filterTermInputBlur(): void {
    setTimeout(() => {
      this.filterSearchResults = [];
    }, 200)
  }

  filterTermInputFocus(): void {
    this.performFilterSearch();
  }

  setActiveDateFilterIndex(index: number): void {
    if (this.dateFilters[index].label === 'CUSTOM') return;

    this.activeDateFilterIndex = index;

    this.setDatepickerDates();

    this.fetchAll();
  }

  addFilterTerm(filterTerm: FilterTerm): void {
    this.filterSearchResults = [];
    this.currentFilterTerm = '';
    this.filterTerms.push(filterTerm);

    this.termFilterDebouncer$.next(true);
  }

  resetFilters(): void {
    this.filterTerms = [];
    this.activeDateFilterIndex = 3;
    this.fetchAll();
    this.router.navigate(['dashboard']);
  }

  removeFilterTerm(filterTerm: FilterTerm): void {
    let index = this.getFilterTermIndex(filterTerm);

    if (index > -1) {
      this.filterTerms.splice(index,1);
      this.termFilterDebouncer$.next(true);
    }
  }

  performFilterSearch(): void {
    if (this.currentFilterTerm) {
      this.searchService.searchDashboardFilters(this.currentFilterTerm);
    } else {
      this.filterSearchResults = [];
    }
  }

  saveChart(chartInstance): void {
    this.chart = chartInstance;
  }

  getStartDate(): Moment {
    return this.dateFilters[this.activeDateFilterIndex].start;
  }

  getEndDate(): Moment {
    return this.dateFilters[this.activeDateFilterIndex].end;
  }

  extractDateFromParams(data): void {
    if (!data['start'] || !data['end']) {
      this.activeDateFilterIndex = 3;

      return;
    }

    let sDate = utc(data['start']);
    let eDate = utc(data['end']);

    let tempActive: number = -1;
    for (let i = 0; i < this.dateFilters.length; i++) {
      if (areSame(sDate, this.dateFilters[i].start) && areSame(eDate, this.dateFilters[i].end)) {
        tempActive = i;
        break;
      }
    }

    let customDateIndex = this.dateFilters.length - 1;
    this.activeDateFilterIndex = tempActive !== -1 ? tempActive : customDateIndex;

    if (this.activeDateFilterIndex === customDateIndex) {
      this.dateFilters[customDateIndex].start = sDate;
      this.dateFilters[customDateIndex].end = eDate;
    }
  }

  extractFiltersFromParams(data: any) : void {
    Object.keys(data).forEach(groupKey => {
      if (groupKey !== 'start' && groupKey !== 'end') {
        let group = data[groupKey];

        Object.keys(group).forEach(key => {
          this.filterTerms.push({type: groupKey, id: group[key].id, label: group[key].label})
        })
      }
    });
  }

  getShareUrl(): string {
    let url = environment.auth0RedirectUrl + '/dashboard?f=';

    let filters = {'start': this.getStartDate().format(), 'end': this.getEndDate().format()};

    for (let i in this.filterTerms) {
      let currentFilter = this.filterTerms[i];
      let formattedFilter = {id: currentFilter.id, label: currentFilter.label};

      if (filters[currentFilter.type]) {
        filters[currentFilter.type].push(formattedFilter);
      } else {
        filters[currentFilter.type] = [formattedFilter];
      }
    }

    return url + btoa(JSON.stringify(filters));
  }

  dateSelected(value: any): void {
    let lastIndex = this.dateFilters.length-1;

    this.dateFilters[lastIndex].start = flatDown(utc(value.start));
    this.dateFilters[lastIndex].end = flatUp(utc(value.end));

    this.activeDateFilterIndex = lastIndex;

    this.fetchAll();
  }

  toggleAdvanced(): void {
    this.advanced = !this.advanced;
  }

  showResetButton(): boolean {
    return (this.filterTerms && this.filterTerms.length > 0) || this.activeDateFilterIndex !== 3;
  }

  applyFilters(): void {
    this.fetchAll();
  }

  private fetchAll(): void {
    this.fetchEventFunnel();
    this.fetchTransactionOverview();
    this.fetchTransactionSummary();
    this.fetchAffiliateEvents();
    this.fetchCampaignDelta();
  }

  private fetchTransactionSummary(): void {
    let filters: FilterTerm[] = this.filterTerms;

    this.progressBarService.showTopProgressBar();
    this.analyticsService.getTransactionSummaries(this.getStartDate().format(), this.getEndDate().format(), filters);
  }

  private fetchTransactionOverview(): void {
    this.progressBarService.showTopProgressBar();
    this.analyticsService.getTransactionOverview(this.getStartDate().format(), this.getEndDate().format());
  }

  private fetchEventFunnel(): void {
    this.progressBarService.showTopProgressBar();
    this.analyticsService.getEventFunnel(this.getStartDate().format(), this.getEndDate().format());
  }

  private fetchCampaignDelta(): void {
    this.progressBarService.showTopProgressBar();
    this.analyticsService.getCampaignDelta(this.getStartDate().format(), this.getEndDate().format());
  }

  private fetchAffiliateEvents(): void {
    this.progressBarService.showTopProgressBar();
    this.analyticsService.getAffiliateEvents(this.getStartDate().format(), this.getEndDate().format());
  }

  private parseFilterSearchResults(results: any[]): FilterTerm[] {
    let terms: FilterTerm[] = [];

    results.forEach(result => {
      if (this.filterTermsContain(result.id)) return;

      let type = result.fields.entity_type;
      let label = '';

      switch (type) {
        case 'customer' : {
          label = `${result.fields.firstname} ${result.fields.lastname}`;
          break;
        }
        case 'transaction' : {
          label = result.fields.alias;
          break;
        }
        case 'affiliate': {
          label = result.fields.affiliate_id;
          break;
        }
        default: {
          label = result.fields.name;
        }
      }

      terms.push({id: result.id, type: type, label: label});
    });

    return terms;
  }

  private filterTermsContain(id: string): boolean {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (this.filterTerms[i].id === id) {
        return true;
      }
    }

    return false;
  }

  private setTransactionSummaryChartData(summaries: TransactionSummary[]): void {
    this.successData = [];
    this.declineData = [];
    this.errorData = [];

    summaries.forEach(summary => {
      summary.results.forEach(result => {
        let data = [summary.time.valueOf(), result.amount];

        switch (result.processorResult) {
          case ('success'): {
            this.successData.push(data);
            break;
          }
          case ('decline'): {
            this.declineData.push(data);
            break;
          }
          default: {
            this.errorData.push(data);
          }
        }
      })
    });

    this.redrawChartData()
  }

  private redrawChartData(): void {
    this.chart.series[0].setData(this.successData, true);
    this.chart.series[1].setData(this.declineData, true);
    this.chart.series[2].setData(this.errorData, true);
  }

  private getFilterTermIndex(filterTerm: FilterTerm): number {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (filterTerm.id === this.filterTerms[i].id)
        return i;
    }

    return -1;
  }

  setDatepickerDates(): void {
    if (this.dateRangePicker) {
      this.dateRangePicker.datePicker.setStartDate(this.getStartDate());
      this.dateRangePicker.datePicker.setEndDate(this.getEndDate());
    }
  }
}
