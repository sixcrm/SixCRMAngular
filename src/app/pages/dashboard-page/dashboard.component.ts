import {Component, OnInit, OnDestroy} from '@angular/core';
import {utc, Moment} from 'moment';
import {Subject} from 'rxjs';
import {DaterangepickerConfig} from 'ng2-daterangepicker';
import {AnalyticsService} from '../../shared/services/analytics.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {AnalyticsStorageService} from '../../shared/services/analytics-storage.service';

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
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  filterTerms: FilterTerm[] = [];
  filterSearchResults: FilterTerm[] = [];
  immutableFilterTerms: FilterTerm[] = [];
  date: DateMap;

  start: Moment = utc().subtract(3, 'M');
  end: Moment = utc();

  shareUrl: string;

  datepickerVisible: boolean = false;

  advanced: boolean = false;

  private termFilterDebouncer$: Subject<boolean>;
  private unsubscribe$: Subject<boolean>;

  constructor(
    private daterangepickerOptions: DaterangepickerConfig,
    public analyticsService: AnalyticsService,
    private route: ActivatedRoute,
    private router: Router,
    private analyticsStorageService: AnalyticsStorageService
  ) {
    this.termFilterDebouncer$ = new Subject();
    this.unsubscribe$ = new Subject();
  }

  ngOnInit() {
    this.termFilterDebouncer$
      .takeUntil(this.unsubscribe$)
      .filter(() => !this.advanced)
      .debounceTime(500)
      .subscribe(() => {
        this.fetchFilterDependents();
      });

    this.route.queryParams.takeUntil(this.unsubscribe$).subscribe(params => {
      this.filterTerms = [];

      if (params['f']) {
        let data = JSON.parse(atob(params['f']));

        this.extractDateFromParams(data);
        this.extractFiltersFromParams(data);
      } else {
        this.extractFiltersFromStorage();
      }

      this.initDatepicker();
      this.fetchAll();
    });
  }

  initDatepicker(): void {
    this.daterangepickerOptions.settings = {
      parentEl: '.datepicker--custom',
      startDate: this.start,
      endDate: this.end,
      locale: { format: 'MM/DD/YYYY' },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
    this.analyticsService.clearAllSubjects();
  }

  addFilterTerm(filterTerm: FilterTerm): void {
    this.filterSearchResults = [];
    this.filterTerms.push(filterTerm);

    this.termFilterDebouncer$.next(true);
  }

  resetFilters(): void {
    this.filterTerms = [];
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

  extractFiltersFromStorage(): void {
    let start = this.analyticsStorageService.getStartDate();
    let end = this.analyticsStorageService.getEndDate();

    if (start && end) {
      this.extractDateFromParams({start: start, end: end});
    }

    let filterTerms = this.analyticsStorageService.getFilters();
    if (filterTerms) {
      this.filterTerms = filterTerms;
    }
  }

  setShareUrl(): void {
    this.shareUrl = environment.auth0RedirectUrl + '/dashboard?f=' + this.encodeParams();
  }

  dateChanged(date: DateMap): void {
    this.start = date.start;
    this.end = date.end;

    this.fetchAll();
  }

  applyFilters(): void {
    this.fetchAll();
  }

  getLastUpdatedTime(): string {
    return `Refresh Dashboard. Last updated: ${this.analyticsStorageService.getLastUpdatedTime().format('LT')}`;
  }

  refresh(): void {
    this.analyticsStorageService.refresh();
    this.analyticsService.clearAllSubjects();
    this.fetchAll();
  }

  encodeParams(): string {
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

    return btoa(JSON.stringify(filters))
  }

  private fetchAll(): void {
    this.date = {start: this.start, end: this.end};
    this.immutableFilterTerms =  this.filterTerms.slice();

    this.setShareUrl();
  }

  private fetchFilterDependents(): void {
    this.immutableFilterTerms = this.filterTerms.slice();

    this.setShareUrl();
  }

  private getFilterTermIndex(filterTerm: FilterTerm): number {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (filterTerm.id === this.filterTerms[i].id)
        return i;
    }

    return -1;
  }
}
