import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../authentication/authentication.service';
import {Router} from '@angular/router';
import {Moment} from 'moment';
import {FilterTableTab} from '../shared/components/filter-table/filter-table.component';
import {AsyncSubject} from 'rxjs';
import {ColumnParams} from '../shared/models/column-params.model';

export abstract class AbstractEntityReportIndexComponent<T> {

  date: {start: Moment, end: Moment};

  tabs: FilterTableTab[] = [];

  options: string[] = [];

  loadingData: boolean = false;

  columnParams: ColumnParams<T>[] = [];

  sortedColumnParams: ColumnParams<T> = new ColumnParams<T>();

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    protected authService: AuthenticationService,
    protected dialog: MatDialog,
    protected router: Router,
  ) { }

  init() {

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

  changeDate(date: {start: Moment, end: Moment}) {
    this.date = date;

    this.refetch();
  }

  refetch() {

  }

  loadMore() {

  }

  openFiltersDialog(component) {
    let filtersDialog = this.dialog.open(component, { disableClose : true });

    filtersDialog.afterClosed().take(1).subscribe(result => {
      filtersDialog = null;

      if (!result) return;

      if (result.filters && (!result.meta || result.meta.apply)) {
        this.refetch();
      }

      if (result.meta) {
        if (result.meta.apply) {
          this.tabs = this.tabs.map(tab => {
            tab.selected = false;

            return tab;
          })
        }

        this.tabs = [...this.tabs, {label: result.meta.name, selected: result.meta.apply, visible: true, custom: true}]
      }
    });
  }
}
