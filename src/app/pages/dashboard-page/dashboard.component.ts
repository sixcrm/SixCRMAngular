import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {utc, Moment} from 'moment';
import {SearchService} from '../../shared/services/search.service';
import {TransactionsService} from '../../shared/services/transactions.service';
import {Subject} from 'rxjs';
import {TransactionSummary} from '../../shared/models/transaction-summary.model';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {DaterangepickerConfig, DaterangePickerComponent} from 'ng2-daterangepicker';
import {TransactionOverview} from '../../shared/models/transaction-overview.model';

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
    {label: '1M', start: utc().subtract(1,'M'), end: utc()},
    {label: '3M', start: utc().subtract(3,'M'), end: utc()},
    {label: '6M', start: utc().subtract(6,'M'), end: utc()},
    {label: 'YTD', start: utc().startOf('year'), end: utc()},
    {label: '1Y', start: utc().subtract(1,'y'), end: utc()},
    {label: 'ALL', start: utc().subtract(10,'y'), end: utc()},
    {label: 'CUSTOM', start: utc(), end: utc()}
  ];
  activeDateFilterIndex: number = 1;

  overviewOptions: any[] = [
    {title: 'New Sales', mapToResult: (overview: TransactionOverview) => overview.newSale},
    {title: 'Upsells', mapToResult: (overview: TransactionOverview) => overview.upsell},
    {title: 'Main', mapToResult: (overview: TransactionOverview) => overview.main},
    {title: 'Rebills', mapToResult: (overview: TransactionOverview) => overview.rebill},
    {title: 'Declines', mapToResult: (overview: TransactionOverview) => overview.decline},
    {title: 'Errors', mapToResult: (overview: TransactionOverview) => overview.error}
  ];

  chart;
  chartOptions = {
    credits: {enabled: false},
    rangeSelector: {enabled: false},
    series: [
      {
        name: 'successes',
        color: '#F28933'
      },
      {
        name: 'declines',
        color: '#407CC1'
      },
      {
        name: 'errors',
        color: '#9ADDFB'
      }
    ]
  };
  successData = [];
  declineData = [];
  errorData = [];

  @ViewChild(DaterangePickerComponent)
  dateRangePicker: DaterangePickerComponent;
  datepickerVisible: boolean = false;

  private unsubscribe$: Subject<boolean>;
  private transactionsSummaryFetchDebouncer$: Subject<boolean>;
  private transactionsOverviewFetchDebouncer$: Subject<boolean>;

  constructor(
    private searchService: SearchService,
    public transactionsService: TransactionsService,
    private progressBarService: ProgressBarService,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    this.unsubscribe$ = new Subject();
    this.transactionsSummaryFetchDebouncer$ = new Subject();
    this.transactionsOverviewFetchDebouncer$ = new Subject();
  }

  ngOnInit() {
    this.daterangepickerOptions.settings = {
      parentEl: '.datepicker--custom',
      startDate: this.getStartDate(),
      endDate: this.getEndDate(),
      locale: { format: 'MM/DD/YYYY' },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false
    };

    this.searchService.dashboardFilterResults$.takeUntil(this.unsubscribe$).subscribe(results => {
      this.filterSearchResults = this.parseFilterSearchResults(results.hit);
    });

    this.transactionsService.transactionsSummaries$.takeUntil(this.unsubscribe$).subscribe(summaries => {
      this.setTransactionSummaryChartData(summaries);
      this.progressBarService.hideTopProgressBar();
    });

    this.transactionsSummaryFetchDebouncer$.takeUntil(this.unsubscribe$).debounceTime(500).subscribe(() => this.fetchTransactionSummary());
    this.transactionsOverviewFetchDebouncer$.takeUntil(this.unsubscribe$).debounceTime(500).subscribe(() => this.fetchTransactionOverview());

    this.fetchTransactionSummary();
    this.fetchTransactionOverview();
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
    this.transactionsSummaryFetchDebouncer$.next(true);
    this.transactionsOverviewFetchDebouncer$.next(true);
  }

  addFilterTerm(filterTerm: FilterTerm): void {
    this.filterSearchResults = [];
    this.currentFilterTerm = '';
    this.filterTerms.push(filterTerm);

    this.transactionsSummaryFetchDebouncer$.next(true);
  }

  removeFilterTerm(filterTerm: FilterTerm): void {
    let index = this.getFilterTermIndex(filterTerm);

    if (index > -1) {
      this.filterTerms.splice(index,1);
      this.transactionsSummaryFetchDebouncer$.next(true);
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

  dateSelected(value: any): void {
    let lastIndex = this.dateFilters.length-1;

    this.dateFilters[lastIndex].start = utc(value.start);
    this.dateFilters[lastIndex].end = utc(value.end);

    this.activeDateFilterIndex = lastIndex;
    this.transactionsSummaryFetchDebouncer$.next(true);
    this.transactionsOverviewFetchDebouncer$.next(true);
  }

  private fetchTransactionSummary(): void {
    this.progressBarService.showTopProgressBar();
    this.transactionsService.getTransactionSummaries(this.getStartDate().format(), this.getEndDate().format(), this.filterTerms);
  }

  private fetchTransactionOverview(): void {
    this.progressBarService.showTopProgressBar();
    this.transactionsService.getTransactionOverview(this.getStartDate().format(), this.getEndDate().format());
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
