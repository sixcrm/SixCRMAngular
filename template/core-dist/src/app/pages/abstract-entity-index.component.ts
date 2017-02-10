import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {DeleteDialogComponent} from './delete-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import {ProgressBarService} from '../shared/services/progress-bar.service';

export abstract class AbstractEntityIndexComponent<T> {
  private deleteDialogRef: MdDialogRef<DeleteDialogComponent>;

  constructor(
    private service: AbstractEntityService<T>,
    private router: Router,
    private route: ActivatedRoute,
    private deleteDialog: MdDialog,
    protected progressBarService?: ProgressBarService
  ) {}

  init(): void {
    this.service.getEntities();
    this.progressBarService.showTopProgressBar();
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
}
