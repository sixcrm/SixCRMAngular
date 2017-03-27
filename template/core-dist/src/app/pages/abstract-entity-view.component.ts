import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {Subscription} from 'rxjs';
import {ProgressBarService} from '../shared/services/progress-bar.service';
import {Entity} from '../shared/models/entity.interface';

export abstract class AbstractEntityViewComponent<T extends Entity<T>> {

  protected addMode: boolean = false;
  protected viewMode: boolean = false;
  protected updateMode: boolean = false;
  protected mode: string = '';
  protected entityId: string = '';
  protected entity: T;
  protected entityBackup: T;

  protected routeSubscription: Subscription;
  protected entityViewSubscription: Subscription;
  protected entityCreatedSubscription: Subscription;
  protected entityUpdatedSubscription: Subscription;

  constructor(private service: AbstractEntityService<T>, route: ActivatedRoute, protected progressBarService?: ProgressBarService) {
    this.routeSubscription = route.params.subscribe((params: Params) => {
      // if (params['type'] === 'view') {
      //   this.mode = 'View';
      //   this.viewMode = true;
      //   this.entityId = params['id'];
      // }
      //
      // if (params['type'] === 'openAddEntity') {
      //   this.mode = 'Add';
      //   this.addMode = true;
      // }
      //
      // if (params['type'] == 'update') {
      //   this.mode = 'Update';
      //   this.updateMode = true;
      //   this.entityId = params['id'];
      // }

      this.viewMode = true;
      this.entityId = params['id'];
    });
  }

  protected init(): void {
    this.entityViewSubscription = this.service.entity$.subscribe((entity: T) => {
      this.entity = entity;

      if (this.updateMode) {
        this.entityBackup = entity.copy();
      }
      this.progressBarService.hideTopProgressBar();
    });

    this.entityCreatedSubscription = this.service.entityCreated$.subscribe((created: T) => {
      this.entity = created;
      this.addMode = false;
      this.viewMode = true;
      this.mode = 'Created';
      this.progressBarService.hideTopProgressBar();
    });

    this.entityUpdatedSubscription = this.service.entityUpdated$.subscribe((updated: T) => {
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
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.entityCreatedSubscription) {
      this.entityCreatedSubscription.unsubscribe();
    }

    if (this.entityUpdatedSubscription) {
      this.entityUpdatedSubscription.unsubscribe();
    }

    if (this.entityViewSubscription) {
      this.entityViewSubscription.unsubscribe();
    }
  }
}
