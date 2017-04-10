import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {Subject} from 'rxjs';
import {ProgressBarService} from '../shared/services/progress-bar.service';
import {Entity} from '../shared/models/entity.interface';

export abstract class AbstractEntityViewComponent<T extends Entity<T>> {

  addMode: boolean = false;
  viewMode: boolean = false;
  updateMode: boolean = false;
  mode: string = '';
  entityId: string = '';
  entity: T;
  entityBackup: T;

  protected unsubscribe$: Subject<void> = new Subject<void>();

  constructor(public service: AbstractEntityService<T>, route: ActivatedRoute, protected progressBarService?: ProgressBarService) {
    route.params.takeUntil(this.unsubscribe$).subscribe((params: Params) => {
      this.viewMode = true;
      this.entityId = params['id'];
    });
  }

  protected init(): void {
    this.service.entity$.takeUntil(this.unsubscribe$).subscribe((entity: T) => {
      this.entity = entity;
      this.entityBackup = entity.copy();

      this.progressBarService.hideTopProgressBar();
    });

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe((created: T) => {
      this.entity = created;
      this.addMode = false;
      this.viewMode = true;
      this.mode = 'Created';
      this.progressBarService.hideTopProgressBar();
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe((updated: T) => {
      this.entity = updated;
      this.updateMode = false;
      this.viewMode = true;
      this.mode = 'Updated';
      this.progressBarService.hideTopProgressBar();
    });

    if (this.viewMode || this.updateMode) {
      this.service.getEntity(this.entityId);
      this.progressBarService.showTopProgressBar();
    }
  }

  protected saveEntity(entity: T): void {
    if (this.addMode) {
      this.service.createEntity(entity);
      this.progressBarService.showTopProgressBar();
    }
  }

  protected updateEntity(entity: T): void {
    if (this.updateMode) {
      this.service.updateEntity(entity);
      this.progressBarService.showTopProgressBar();
    }
  }

  protected cancelUpdate(): void {
    this.entity = this.entityBackup.copy();
  }

  protected destroy(): void {
    this.unsubscribe$.complete();
  }

  protected changeMode(): void {
    this.viewMode = !this.viewMode;
    this.updateMode = !this.updateMode;

    if (this.viewMode) {
      this.cancelUpdate();
    }
  }
}
