import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {DeleteDialogComponent} from './delete-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import {ProgressBarService} from '../shared/services/progress-bar.service';
import {PaginationService} from '../shared/services/pagination.service';
import {AuthenticationService} from '../authentication/authentication.service';
import {Entity} from '../shared/models/entity.interface';
import {ViewChild} from '@angular/core';

export abstract class AbstractEntityIndexComponent<T extends Entity<T>> {

  @ViewChild('indexR') indexR;

  deleteDialogRef: MdDialogRef<DeleteDialogComponent>;
  limit: number;
  page: number = 0;
  hasMore: boolean;
  entities: T[] = [];
  entitiesHolder: T[] = [];
  paginationValues: number[] = [5, 10, 15, 20, 30, 40, 50];

  showEntityDetails: boolean = false;
  showEntityId: string;
  fullScreen: boolean = false;
  mode: string;

  constructor(
    protected service: AbstractEntityService<T>,
    protected authService: AuthenticationService,
    private deleteDialog: MdDialog,
    protected progressBarService?: ProgressBarService,
    protected paginationService?: PaginationService
  ) { }

  init(): void {
    this.service.entities$.subscribe((entities: T[]) => {
      this.entitiesHolder = [...this.entitiesHolder, ...entities];
      this.reshuffleEntities();
      this.progressBarService.hideTopProgressBar();
    });

    this.service.entityDeleted$.subscribe((entity: T) => {
      this.deleteEntityLocal(entity);
      this.showEntityDetails = false;
      this.progressBarService.hideTopProgressBar();
    });
    this.service.entityCreated$.subscribe(() => this.reshuffleEntities());
    this.service.entityUpdated$.subscribe((entity: T) => {
      this.updateEntityLocal(entity);
      this.progressBarService.hideTopProgressBar();
    });
    this.service.entitiesHasMore$.subscribe((hasMore: boolean) => this.hasMore = hasMore);
    this.paginationService.limit$.subscribe((lim: number) => this.limit = lim);
    this.authService.activeAclChanged$.subscribe(() => {
      this.resetEntities();
      this.service.getEntities(this.limit);
    });

    this.service.resetPagination();
    this.service.getEntities(this.limit);
    this.progressBarService.showTopProgressBar();
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
    this.mode = 'view';
    this.showEntityId = id;
    this.showEntityDetails = true;
    this.progressBarService.showTopProgressBar();

    this.calculateViewEntityHeight();
  }

  deleteEntity(id: string): void {
    this.deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, { disableClose : true });

    this.deleteDialogRef.afterClosed().subscribe(result => {
      this.deleteDialogRef = null;
      if (result.success) {
        this.service.deleteEntity(id);
        this.progressBarService.showTopProgressBar();
      }
    });
  }

  openAddEntity(): void {
    this.mode = 'add';
    this.showEntityDetails = true;
    this.calculateViewEntityHeight();
  }

  copyEntity(id: string): void {

  }

  exportEntity(id: string): void {

  }

  hasMorePages(): boolean {
    let nextPage = this.page + 1;
    return this.hasMore || this.entitiesHolder.slice(nextPage * this.limit, nextPage * this.limit + this.limit).length > 0;
  }

  hideEntityDetails(): void {
    this.showEntityDetails = false;
  }

  hasWritePermission(): boolean {
    return this.service.hasWritePermission();
  }

  protected reshuffleEntities(): void {
    let tempEntities = this.entitiesHolder.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (tempEntities.length >= this.limit || !this.hasMore) {
      this.entities = tempEntities;
    } else {
      if (this.hasMore) {
        this.service.getEntities(this.limit - tempEntities.length);
        this.progressBarService.showTopProgressBar();
      }
    }
  }

  protected resetEntities(): void {
    this.service.resetPagination();
    this.entitiesHolder = [];
    this.entities = [];
  }

  private deleteEntityLocal(entity: T): void {
    let index: number = this.indexOfEntity(entity);

    if (index > -1) {
      this.entitiesHolder.splice(index, 1);
      this.reshuffleEntities();
    }
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

  private calculateViewEntityHeight(): void {
    if (this.indexR && this.indexR.nativeElement) {
      let viewportHeight = window.innerHeight;
      let indexHeight = this.indexR.nativeElement.offsetHeight;

      this.fullScreen = indexHeight < viewportHeight;
    }
  }
}
