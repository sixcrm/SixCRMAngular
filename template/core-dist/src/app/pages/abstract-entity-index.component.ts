import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {DeleteDialogComponent} from './delete-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import {ProgressBarService} from '../shared/services/progress-bar.service';

export abstract class AbstractEntityIndexComponent<T> {
  private deleteDialogRef: MdDialogRef<DeleteDialogComponent>;
  protected limit: number = 10;
  protected newLimit: number = 10;
  protected page: number = 0;
  private hasMore: boolean;
  private entities: T[] = [];
  private entitiesHolder: T[] = [];

  constructor(
    private service: AbstractEntityService<T>,
    private router: Router,
    private route: ActivatedRoute,
    private deleteDialog: MdDialog,
    protected progressBarService?: ProgressBarService
  ) { }

  init(): void {
    this.service.entities$.subscribe((entities: T[]) => {
      this.entitiesHolder = [...this.entitiesHolder, ...entities];
      this.reshuffleEntities();
      this.progressBarService.hideTopProgressBar();
    });

    this.service.entitiesHasMore$.subscribe((hasMore: boolean) => this.hasMore = hasMore);
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

  updateLimit(): void {
    let firstElement: number = this.page * this.limit;

    this.page = Math.floor(firstElement / this.newLimit);
    this.limit = +this.newLimit;

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
    this.router.navigate(['view', id], { relativeTo: this.route});
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
}
