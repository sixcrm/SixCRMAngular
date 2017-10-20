import {PaginationService} from '../shared/services/pagination.service';
import {AsyncSubject} from 'rxjs';
import {utc, Moment} from 'moment';
import {FilterTerm, DateMap, flatUp} from '../shared/components/advanced-filter/advanced-filter.component';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {scrollContentToTop} from '../shared/utils/document.utils';
import {ReportColumnParams} from './components/report-table/report-table.component';

export abstract class ReportsAbstractComponent<T> {
  limit = 10;
  page = 0;
  columnParams: ReportColumnParams<T>[] = [];
  reports: T[] = [];
  reportsToDisplay: T[] = [];
  hasMore: boolean = true;

  start: Moment;
  end: Moment;
  filterTerms: FilterTerm[] = [];
  immutableFilterTerms: FilterTerm[] = [];
  dateMap: DateMap;
  shareUrl: string;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();
  fetchFunction: () => void;

  endpointExtension: string;

  constructor(protected route: ActivatedRoute, protected paginationService: PaginationService) { }

  protected destroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  init() {
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

  getShareUrl(): void {
    const url = environment.auth0RedirectUrl + `/reports/${this.endpointExtension}?f=`;

    this.shareUrl = url + this.encodeFilters();
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

  filterSelected(filter: FilterTerm): void {
    this.addFilter(filter);
    scrollContentToTop();
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

  fetchNext(): void {
    this.page++;
    this.reshuffle();
  }

  fetchPrevious(): void {
    this.page--;
    this.reshuffle();
  }

  updateLimit(limit: number): void {
    if (!limit) return;

    let firstElement: number = this.page * this.limit;
    this.page = Math.floor(firstElement / limit);
    this.limit = limit;

    this.reshuffle();
  }

  getPaginationString(): string {
    const from = this.page * this.limit + 1;
    const to = this.page * this.limit + this.limit;
    const of = to;
    return `${from}-${to} of ${of}`;
  }

  reshuffle(): void {
    let temp = this.reports.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (temp.length >= this.limit || !this.hasMore) {
      this.reportsToDisplay = temp;
    } else {
      this.fetchFunction();
    }
  }

  resetAndFetch() {
    this.reports = [];
    this.hasMore = true;
    this.page = 0;
    this.fetchFunction();
  }

  protected encodeFilters(data?: {start?: Moment, end?: Moment, filterTerms?: FilterTerm[]}) {
    const s = data && data.start ? data.start : this.start.clone();
    const e = data && data.end ? data.end : this.end.clone();
    const f = data && data.filterTerms ? data.filterTerms : this.filterTerms;

    let filters = {'start': s.format(), 'end': e.format()};

    for (let i in f) {
      let currentFilter = f[i];
      let formattedFilter = {id: currentFilter.id, label: currentFilter.label};

      if (filters[currentFilter.type]) {
        filters[currentFilter.type].push(formattedFilter);
      } else {
        filters[currentFilter.type] = [formattedFilter];
      }
    }

    return btoa(JSON.stringify(filters))
  }

  protected getFilterTermIndex(filterTerm: FilterTerm): number {
    for (let i = 0; i < this.filterTerms.length; i++) {
      if (filterTerm.id === this.filterTerms[i].id)
        return i;
    }

    return -1;
  }
}
