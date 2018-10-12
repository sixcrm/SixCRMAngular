import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../authentication/authentication.service';
import {Router, Params} from '@angular/router';
import {Moment} from 'moment';
import {FilterTableTab} from '../shared/components/filter-table/filter-table.component';
import {AsyncSubject} from 'rxjs';
import {ColumnParams} from '../shared/models/column-params.model';
import {utc} from 'moment';

export abstract class AbstractEntityReportIndexComponent<T> {

  defaultDate: {start: Moment, end: Moment} = {start: utc().subtract(7,'d'), end: utc()};
  date: {start: Moment, end: Moment};
  lastCountsDate: {start: Moment, end: Moment};

  tabs: FilterTableTab[] = [];
  filters: {facet: string, values: string[]}[] = [];
  options: string[] = [];
  loadingData: boolean = false;
  columnParams: ColumnParams<T>[] = [];
  sortedColumnParams: ColumnParams<T> = new ColumnParams<T>();

  hasMore: boolean = true;
  limit: number = 25;
  entities: T[] = [];

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    protected authService: AuthenticationService,
    protected dialog: MatDialog,
    protected router: Router,
  ) { }

  init() {

  }

  parseParams(params: Params): void {
    this.date = {
      start: params['start'] ? utc(params['start']) : this.defaultDate.start.clone(),
      end: params['end'] ? utc(params['end']) : this.defaultDate.end.clone()
    };

    if (params['sort'] && params['sortOrder']) {
      for (let i = 0; i < this.columnParams.length; i++) {
        if (this.columnParams[i].sortName === params['sort']) {
          this.columnParams[i].sortApplied = true;
          this.columnParams[i].sortOrder = params['sortOrder'];
        } else {
          this.columnParams[i].sortApplied = false;
        }
      }
    }

    for (let i = 0; i < this.tabs.length; i++) {
      if (!params['tab']) {
        this.tabs[i].selected = (i === 0);
      } else {
        this.tabs[i].selected = this.tabs[i].visible && this.tabs[i].label === params['tab'];
      }
    }

    if (params['filters']) {
      this.filters = JSON.parse(params['filters']);
    }
  }

  getSortColumn(): ColumnParams<T> {
    for (let i = 0; i < this.columnParams.length; i++) {
      if (this.columnParams[i].sortApplied) {
        return this.columnParams[i];
      }
    }

    return this.columnParams[1];
  }

  destroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  selectTab(tab: FilterTableTab) {
    this.tabs = this.tabs.map(t => {
      t.selected = t.label === tab.label;

      return t;
    });

    this.refetch();
  }

  getSelectedTab(): FilterTableTab {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].visible && this.tabs[i].selected) {
        return this.tabs[i];
      }
    }

    return null;
  }

  getFacets(): {facet: string, values: string[]}[] {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].selected && this.tabs[i].visible) {
        return this.tabs[i].filters || [];
      }
    }

    return this.filters || [];
  }

  changeDate(date: {start: Moment, end: Moment}) {
    this.date = date;

    this.refetch();
  }

  refetch(params?: {match: boolean}) {
    this.hasMore = true;
    this.entities = [];

    this.fetch();

    if (params && params.match) {
      this.matchFiltersWithTabs();
    }
  }

  matchFiltersWithTabs() {
    if (!this.filters || this.filters.length === 0) {
      this.tabs = this.tabs.map(t => {
        t.selected = t.label === 'All';

        return t;
      })
    } else {
      let found: boolean;
      for (let i = 0; i < this.tabs.length; i++) {
        if (!found) {
          this.tabs[i].selected = this.filtersEquals(this.tabs[i].filters, this.filters);
          found = this.tabs[i].selected;
        } else {
          this.tabs[i].selected = false;
        }
      }
    }
  }

  filtersEquals(first: {facet: string, values: string[]}[], second: {facet: string, values: string[]}[]): boolean {
    if (!first || !second || first.length !== second.length) return false;

    const sortFacetFn = (a,b) => (a.facet > b.facet) ? -1 : (a.facet < b.facet) ? 1 : 0;

    const firstSorted = first.sort(sortFacetFn);
    const secondSorted = second.sort(sortFacetFn);

    for (let i = 0; i < firstSorted.length; i++) {
      if (!firstSorted[i].values || !firstSorted[i].values || firstSorted[i].values.length !== secondSorted[i].values.length) {
        return false;
      }

      const firstNames = firstSorted[i].values.sort();
      const secondNames = secondSorted[i].values.sort();

      for (let j = 0; j < firstNames.length; j++) {
        if (firstNames[j] !== secondNames[j]) return false;
      }
    }

    return true;
  }

  abstract fetch();

  loadMore() {
    if (this.loadingData || !this.hasMore) return;

    this.fetch();
  }

  openFiltersDialog(component: any) {
    let filtersDialog = this.dialog.open(component);

    if (this.filters) {
      filtersDialog.componentInstance['init'](this.date.start, this.date.end, this.getFacets());
    }

    filtersDialog.afterClosed().take(1).subscribe(result => {
      filtersDialog = null;

      if (!result) return;

      if (result.filters) {
        this.date.start = result.filters.start || this.date.start;
        this.date.end = result.filters.end || this.date.end;
      }

      if (result.meta) {
        if (result.meta.apply) {
          this.tabs = this.tabs.map(tab => {
            tab.selected = false;

            return tab;
          })
        }

        this.tabs = [
          ...this.tabs,
          {
            label: result.meta.name,
            selected: result.meta.apply,
            visible: true,
            custom: true,
            filters: result.filters.filters || []
          }
        ]
      } else {
        this.tabs = this.tabs.map(tab => {
          tab.selected = false;

          return tab;
        });

        this.filters = result.filters.filters || [];
      }

      if (result.filters && (!result.meta || result.meta.apply)) {
        this.refetch({match: !result.meta || !result.meta.apply});
      }
    });
  }

  updateSort(params: ColumnParams<T>) {
    for (let i = 0; i < this.columnParams.length; i++) {
      const resort = this.columnParams[i].sortApplied;
      this.columnParams[i].sortApplied = this.columnParams[i].label === params.label;

      if (this.columnParams[i].sortApplied) {
        if (resort) {
          this.columnParams[i].sortOrder = this.columnParams[i].sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.columnParams[i].sortOrder = 'desc';
        }
      }
    }

    this.refetch();
  }

  updateColumns(columns: ColumnParams<T>[]) {
    this.columnParams = columns;
  }

  updateTabs(tabs: FilterTableTab[]) {
    this.tabs = tabs;
  }
}
