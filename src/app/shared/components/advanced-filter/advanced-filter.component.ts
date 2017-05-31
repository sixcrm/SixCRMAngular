import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import {Moment, utc} from 'moment';
import {DaterangePickerComponent, DaterangepickerConfig} from 'ng2-daterangepicker';
import {SearchService} from '../../services/search.service';
import {AsyncSubject} from 'rxjs';

export interface FilterTerm {
  id: string;
  label: string;
  type: string;
}

export interface DateFilter {
  label: string;
  start: Moment;
  end: Moment;
  selected?: boolean;
}

export interface DateMap {
  start: Moment;
  end: Moment;
}

export function flatDown(m: Moment) { return m.hours(0).minutes(0).seconds(0).millisecond(0) }
export function flatUp(m: Moment) { return m.hours(23).minutes(59).seconds(59)}
export function lateToday() { return utc().hours(23).minutes(59).seconds(59)}
export function areSame(m1: Moment, m2: Moment) { return flatDown(m1).isSame(flatDown(m2)) }

@Component({
  selector: 'advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss']
})
export class AdvancedFilterComponent implements OnInit, OnDestroy {

  colors = {
    affiliate: '#4484CD',
    productschedule: '#4DABF5',
    merchantprovider: '#98DBF9',
    processorresponse: '#FFAD33',
    transactiontype: '#F1862F'
  };

  @Input() set date(date) {
    if (date) {
      this.startDate = date.start;
      this.endDate = date.end;

      this.initDatepicker();
      this.markSelectedDateFilter();
    }
  };

  startDate: Moment = utc();
  endDate: Moment = utc();

  @Input() filterTerms: FilterTerm[] = [];
  @Input() refreshText: string = '';
  @Input() shareUrl: string = 'url';
  @Input() groupByEnabled: boolean = false;

  groupByFilters: string[] = [
    "Merchant Provider",
    "Affiliate",
    "Campaign",
    "Product Schedule",
    "Session",
    "Processor Result",
    "Transaction Type",
    "Transaction Sub-Type",
    "Event Type",
    "Sub-Affiliate 1",
    "Sub-Affiliate 2",
    "Sub-Affiliate 3",
    "Sub-Affiliate 4",
    "Sub-Affiliate 5"
  ];
  groupBy: string;

  filterSearchResults: FilterTerm[] = [];

  @Output() dateChanged: EventEmitter<DateMap> = new EventEmitter();
  @Output() groupByChanged: EventEmitter<string> = new EventEmitter();
  @Output() filterTermAdded: EventEmitter<FilterTerm> = new EventEmitter();
  @Output() filterTermRemoved: EventEmitter<FilterTerm> = new EventEmitter();
  @Output() resetFilters: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshFilters: EventEmitter<boolean> = new EventEmitter();
  @Output() applyFilters: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(DaterangePickerComponent)
  dateRangePicker: DaterangePickerComponent;
  datepickerVisible: boolean = false;

  currentFilterTerm: string = '';
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

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  dateFilters: DateFilter[] = [
    {label: '1D', start: flatDown(utc().subtract(1,'d')), end: lateToday()},
    {label: '1W', start: flatDown(utc().subtract(1,'w')), end: lateToday()},
    {label: '1M', start: flatDown(utc().subtract(1,'M')), end: lateToday()},
    {label: '3M', start: flatDown(utc().subtract(3,'M')), end: lateToday()},
    {label: '6M', start: flatDown(utc().subtract(6,'M')), end: lateToday()},
    {label: 'YTD', start: flatDown(utc().startOf('year')), end: lateToday()},
    {label: '1Y', start: flatDown(utc().subtract(1,'y')), end: lateToday()},
    {label: 'ALL', start: flatDown(utc().subtract(10,'y')), end: lateToday()}
  ];

  constructor(private searchService: SearchService, private daterangepickerOptions: DaterangepickerConfig) { }

  ngOnInit() {
    this.searchService.dashboardFilterResults$.takeUntil(this.unsubscribe$).subscribe(results => {
      this.filterSearchResults = this.parseFilterSearchResults(results.hit);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  dateSelected(value: any): void {
    this.dateChanged.emit({start: flatDown(utc(value.start)), end: flatUp(utc(value.end))})
  }

  setActiveDate(start: Moment, end: Moment) {
    this.dateChanged.emit({start: start, end: flatUp(end)});
  }

  addFilterTerm(filterTerm: FilterTerm): void {
    this.filterSearchResults = [];
    this.currentFilterTerm = '';
    this.filterTermAdded.emit(filterTerm);
  }

  removeFilterTerm(filterTerm: FilterTerm): void {
    this.filterTermRemoved.emit(filterTerm);
  }

  refresh(): void {
    this.refreshFilters.emit(true);
  }

  reset(): void {
    this.resetFilters.emit(true);
  }

  apply(): void {
    this.applyFilters.emit(true);
  }

  showResetButton(): boolean {
    let selected = this.dateFilters.filter(df => df.selected);
    let dateNotChanged = selected && selected.length === 1 && selected[0].label === '3M';

    return this.filterTerms.length !== 0 || !dateNotChanged;
  }

  toggleAdvanced(): void {
    this.advanced = !this.advanced;
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

  performFilterSearch(): void {
    if (this.currentFilterTerm) {
      this.searchService.searchDashboardFilters(this.currentFilterTerm);
    } else {
      this.filterSearchResults = [];
    }
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

  private initDatepicker(): void {
    this.daterangepickerOptions.settings = {
      parentEl: '.datepicker--custom',
      startDate: this.startDate,
      endDate: this.endDate,
      locale: { format: 'MM/DD/YYYY' },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false
    };
  }

  private markSelectedDateFilter(): void {
    Object.keys(this.dateFilters).forEach(key => {
      this.dateFilters[key].selected = areSame(this.startDate, this.dateFilters[key].start) && areSame(this.endDate, this.dateFilters[key].end);
    });
  }

}
