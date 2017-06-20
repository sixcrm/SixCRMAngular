import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {AsyncSubject} from 'rxjs';
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

  protected takeUpdated: boolean = true;
  protected fetchEntityOnInit: boolean = true;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(public service: AbstractEntityService<T>, route: ActivatedRoute, protected progressBarService?: ProgressBarService) {
    route.params.takeUntil(this.unsubscribe$).subscribe((params: Params) => {
      if (params['id'] === 'add') {
        this.addMode = true;
      } else {
        this.viewMode = true;
        this.addMode = false;
        this.entityId = params['id'];
      }
    });
  }

  protected init(notFound?: () => void): void {
    this.service.entity$.takeUntil(this.unsubscribe$).subscribe((entity: T) => {
      if (notFound && (!entity || !entity.id)) {
        notFound();
      }

      this.entity = entity;
      this.entityBackup = entity.copy();

      this.progressBarService.hideTopProgressBar();
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe((updated: T) => {
      if (this.takeUpdated) {
        this.entity = updated;
        this.entityBackup = this.entity.copy();
      }
      this.updateMode = false;
      this.viewMode = true;
      this.mode = 'Updated';
      this.progressBarService.hideTopProgressBar();
    });

    if (this.fetchEntityOnInit && (this.viewMode || this.updateMode)) {
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
    this.service.updateEntity(entity);
    this.progressBarService.showTopProgressBar();
  }

  protected cancelUpdate(): void {
    this.entity = this.entityBackup.copy();
  }

  protected destroy(): void {
    this.unsubscribe$.next(true);
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
