import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {Subscription} from 'rxjs';

export abstract class AbstractEntityViewComponent<T> {

  protected addMode: boolean = false;
  protected viewMode: boolean = false;
  protected updateMode: boolean = false;
  protected mode: string = '';

  protected routeSubscription: Subscription;
  protected entityViewSubscription: Subscription;
  protected entityCreatedSubscription: Subscription;
  protected entityUpdatedSubscription: Subscription;

  constructor(private service: AbstractEntityService<T>, route: ActivatedRoute) {
    this.routeSubscription = route.params.subscribe((params: Params) => {
      if (params['type'] === 'view') {
        this.mode = 'View';
        this.viewMode = true;
        this.service.getEntity(params['id']);
      }

      if (params['type'] === 'addEntity') {
        this.mode = 'Add';
        this.addMode = true;
      }

      if (params['type'] == 'update') {
        this.mode = 'Update';
        this.updateMode = true;
        this.service.getEntity(params['id']);
      }
    });
  }

  protected saveEntity(entity: T): void {
    if (this.addMode) {
      this.service.createEntity(entity);
    }
  }

  protected updateEntity(entity: T): void {
    if (this.updateMode) {
      this.service.updateEntity(entity);
    }
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
