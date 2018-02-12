import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {DeleteDialogComponent} from './delete-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import {PaginationService} from '../shared/services/pagination.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {Entity} from '../shared/models/entity.interface';
import {Output, EventEmitter} from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../shared/models/column-params.model';
import {CustomServerError} from '../shared/models/errors/custom-server-error';
import {areEntitiesIdentical} from '../shared/utils/entity.utils';
import {YesNoDialogComponent} from './yes-no-dialog.component';
import {Modes} from './abstract-entity-view.component';
import 'rxjs/Rx';
import {firstIndexOf} from '../shared/utils/array.utils';

export abstract class AbstractEntityIndexComponent<T extends Entity<T>> {

  deleteDialogRef: MdDialogRef<DeleteDialogComponent>;
  limit: number;
  page: number = 0;
  hasMore: boolean;
  entities: T[] = [];
  entitiesHolder: T[] = [];
  paginationValues: number[] = [5, 10, 15, 20, 30, 40, 50];

  filterValue: string;

  addMode: boolean = false;
  entityFactory: () => T;
  entity: T;
  modes = Modes;
  openInEditModeAfterCreation: boolean = false;

  infiniteScroll: boolean = false;
  shareLimit: boolean = true;

  columnParams: ColumnParams<T>[] = [];
  columnParamsBackup: {label: string, selected: boolean}[] = [];
  sortedColumnParams: ColumnParams<T> = new ColumnParams();

  loadingData: boolean = false;

  serverError: CustomServerError;

  viewAfterCrate: boolean = true;

  protected takeUpdated: boolean = true;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  @Output() allEntities: EventEmitter<T[]> = new EventEmitter();

  constructor(
    public service: AbstractEntityService<T>,
    public authService: AuthenticationService,
    protected deleteDialog: MdDialog,
    protected paginationService?: PaginationService,
    protected router?: Router,
    protected activatedRoute?: ActivatedRoute
  ) { }

  init(fetch: boolean = true): void {
    this.service.entities$.takeUntil(this.unsubscribe$).subscribe((entities: (T[] | CustomServerError)) => {
      if (!this.loadingData) return;

      if (entities instanceof CustomServerError) {
        this.serverError = entities;
        this.loadingData = false;
        return;
      }

      this.loadingData = false;
      this.serverError = null;
      this.entitiesHolder = [...this.entitiesHolder, ...entities];
      this.allEntities.emit(this.entitiesHolder);
      this.reshuffleEntities();
    });
    this.service.entityDeleted$.takeUntil(this.unsubscribe$).subscribe((entity: T) => {
      this.deleteEntityLocal(entity);
    });
    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe((entity: T) => {
      this.entitiesHolder.unshift(entity);
      this.allEntities.emit(this.entitiesHolder);
      this.reshuffleEntities();

      if (this.viewAfterCrate) {
        this.viewEntity(entity.id);
      }
    });
    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe((entity: T) => {
      if (this.takeUpdated) {
        this.updateEntityLocal(entity);
      }
    });
    this.service.entitiesHasMore$.takeUntil(this.unsubscribe$).subscribe((hasMore: boolean) => this.hasMore = hasMore);
    this.paginationService.limit$.takeUntil(this.unsubscribe$).subscribe((lim: number) => {
      if (this.shareLimit) {
        this.limit = lim
      }
    });

    this.service.resetPagination();

    if (fetch) {
      this.loadingData = true;
      this.service.getEntities(this.limit);
    }

    this.backupColumnParams();
    this.resetColumnParams();
  }

  destroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  setInfiniteScroll(infiniteScroll: boolean): void {
    this.infiniteScroll = infiniteScroll;
  }

  updateLimit(lim: number): void {
    if (!lim) return;

    let firstElement: number = this.page * this.limit;

    this.page = Math.floor(firstElement / lim);
    this.limit = lim;

    this.paginationService.setLimit(lim);
    this.reshuffleEntities();
  }

  next(): void {
    this.page++;
    this.reshuffleEntities();
  }

  previous(): void {
    this.page--;
    this.reshuffleEntities();
  }

  viewEntity(id: string): void {
    let options = {relativeTo: this.activatedRoute};
    if (this.openInEditModeAfterCreation) {
      options['queryParams'] = {edit: true};
    }

    this.router.navigate([id], options);
  }

  editEntity(id: string): void {

  }

  deleteEntity(id: string): void {
    this.deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent);

    this.deleteDialogRef.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      this.deleteDialogRef = null;
      if (result && result.success) {
        this.service.deleteEntity(id);
      }
    });
  }

  openAddMode(): void {
    this.entity = this.entityFactory();
    this.addMode = true;
  }

  overlayClicked(event: any): void {
    if (event && event.target && event.target.className === 'full-overlay') {
      this.closeAddMode();
    }
  }

  closeAddMode(): void {
    if (!this.addMode || areEntitiesIdentical(this.entity, this.entityFactory())) {
      this.addMode = false;
      return;
    }

    let yesNoDialogRef = this.deleteDialog.open(YesNoDialogComponent, { disableClose : true });
    yesNoDialogRef.componentInstance.text = 'SINGLEPAGE_CREATECANCELTITLE';
    yesNoDialogRef.componentInstance.secondaryText = 'SINGLEPAGE_CREATECANCELTEXT';
    yesNoDialogRef.componentInstance.yesText = 'SINGLEPAGE_CREATECANCELCLOSE';
    yesNoDialogRef.componentInstance.noText = 'SINGLEPAGE_CREATECANCELCANCEL';


    yesNoDialogRef.afterClosed().take(1).subscribe(result => {
      yesNoDialogRef = null;

      if (result.success) {
        this.addMode = false;
      }
    });
  }

  createEntity(entity: T) {
    this.service.createEntity(entity);
    this.addMode = false;
  }

  copyEntity(id: string): void {

  }

  exportEntity(id: string): void {

  }

  hasMorePages(): boolean {
    let nextPage = this.page + 1;
    return this.hasMore || this.entitiesHolder.slice(nextPage * this.limit, nextPage * this.limit + this.limit).length > 0;
  }

  hasWritePermission(): boolean {
    return this.service.hasWritePermission();
  }

  setSortedColumnParams(params: ColumnParams<T>): void {
    if (params.sortApplied) {
      params.sortOrder = params.sortOrder === 'asc' ? 'desc' : 'asc';
    } else if (this.sortedColumnParams) {
      this.sortedColumnParams.sortApplied = false;
    }

    params.sortApplied = true;
    this.sortedColumnParams = params;
  }

  refreshData() {
    this.loadingData = true;
    this.serverError = null;
    this.service.getEntities(this.limit);
  }

  resetColumnParams() {
    this.columnParamsBackup.forEach(p => {
      const index = firstIndexOf(this.columnParams, (el) => el.label === p.label);

      if (index !== -1) {
        this.columnParams[index].selected = p.selected;
      }
    })
  }

  persistColumnParams() {
    this.backupColumnParams();
  }

  onColumnPreferencesChanged(changed: boolean) {
    if (!changed) {
      this.resetColumnParams();

      return;
    }

    this.persistColumnParams();
  }

  protected reshuffleEntities(): void {
    // if infinite scroll enabled, no reshuffling is needed
    if (this.infiniteScroll) return;

    let tempEntities = this.entitiesHolder.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (tempEntities.length >= this.limit || !this.hasMore) {
      this.entities = tempEntities;
    } else {
      if (this.hasMore) {
        this.loadingData = true;
        this.service.getEntities(this.limit - tempEntities.length);
      }
    }
  }

  protected deleteEntityLocal(entity: T): void {
    let index: number = this.indexOfEntity(entity);

    if (index > -1) {
      this.entitiesHolder.splice(index, 1);
      this.allEntities.emit(this.entitiesHolder);

      this.reshuffleEntities();
    }
  }

  protected resetEntities(): void {
    this.service.resetPagination();
    this.entitiesHolder = [];
    this.allEntities.emit(this.entitiesHolder);

    this.entities = [];
  }

  private updateEntityLocal(entity: T): void {
    let index: number = this.indexOfEntity(entity);

    if (index > -1) {
      this.entitiesHolder[index] = entity;
      this.reshuffleEntities();
    }
  }

  private indexOfEntity(entity: T): number {
    for (let i = 0 ; i < this.entitiesHolder.length ; i++) {
      if (this.entitiesHolder[i].id === entity.id) {
        return i;
      }
    }

    return -1;
  }

  private backupColumnParams() {
    this.columnParamsBackup = this.columnParams.map(p => {
      return {label: p.label, selected: p.selected}
    })
  }
}
