import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {DeleteDialogComponent} from './delete-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import {ProgressBarService} from '../shared/services/progress-bar.service';
import {PaginationService} from '../shared/services/pagination.service';

export abstract class AbstractEntityIndexComponent<T> {
  private deleteDialogRef: MdDialogRef<DeleteDialogComponent>;
  protected limit: number;
  protected page: number = 0;
  private hasMore: boolean;
  private entities: T[] = [];
  private entitiesHolder: T[] = [];
  private paginationValues: number[] = [5, 10, 15, 20, 30, 40, 50];

  protected showEntityDetails: boolean = false;
  protected showEntityId: string;

  constructor(
    private service: AbstractEntityService<T>,
    private router: Router,
    private route: ActivatedRoute,
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

    this.paginationService.limit$.subscribe((lim: number) => this.limit = lim);
    this.service.entitiesHasMore$.subscribe((hasMore: boolean) => this.hasMore = hasMore);
    this.service.resetPagination();
    this.service.getEntities(this.limit);
    this.progressBarService.showTopProgressBar();
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

    if (!this.showEntityDetails) {
      this.showEntityId = id;
      this.showEntityDetails = true;
      this.progressBarService.showTopProgressBar();
    }
  }

  updateEntity(id: string): void {
    this.router.navigate(['update', id], { relativeTo: this.route});
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

  addEntity(): void {
    this.router.navigate(['addEntity'], { relativeTo: this.route});
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
}
