import {AbstractEntityService} from '../entity-services/services/abstract-entity.service';
import {MatDialog} from '@angular/material';
import {PaginationService} from '../shared/services/pagination.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from './abstract-entity-index.component';
import {Entity} from '../shared/models/entity.interface';
import {Moment} from 'moment';
import {FilterTableTab} from '../shared/components/filter-table/filter-table.component';

export abstract class AbstractEntityReportIndexComponent<T extends Entity<T>> extends AbstractEntityIndexComponent<T>{

  date: {start: Moment, end: Moment};

  tabs: FilterTableTab[] = [];

  options: string[] = [];

  constructor(
    service: AbstractEntityService<T>,
    authService: AuthenticationService,
    deleteDialog: MatDialog,
    paginationService?: PaginationService,
    router?: Router,
    activatedRoute?: ActivatedRoute
  ) {
    super(service, authService, deleteDialog, paginationService, router, activatedRoute);
  }

  init() {
    this.shareLimit = false;
    this.limit = 25;
    this.setInfiniteScroll(true);

    super.init();
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
    this.loadingData = true;
    this.resetEntities();
    this.service.getEntities(this.limit)
  }


  loadMore() {
    if (!this.loadingData && this.hasMore) {
      this.loadingData = true;
      this.service.getEntities(20);
    }
  }

  openFiltersDialog(component) {
    let filtersDialog = this.deleteDialog.open(component, { disableClose : true });

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
