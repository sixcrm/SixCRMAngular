import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {AsyncSubject} from 'rxjs';
import {Entity} from '../shared/models/entity.interface';
import {isAllowedNumeric, isAllowedFloatNumeric, isAllowedCurrency} from '../shared/utils/form.utils';
import {getCurrencyMask} from '../shared/utils/mask.utils';

enum Modes {
  Add,
  View,
  Update
}

export abstract class AbstractEntityViewComponent<T extends Entity<T>> {
  addMode: boolean = false;
  viewMode: boolean = false;
  updateMode: boolean = false;

  entityId: string = '';
  entity: T;
  entityBackup: T;

  modes = Modes;

  isNumeric = isAllowedNumeric;
  isCurrency = isAllowedCurrency;
  isFloatNumeric = isAllowedFloatNumeric;
  numberMask = getCurrencyMask();

  protected takeUpdated: boolean = true;
  protected fetchEntityOnInit: boolean = true;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(public service: AbstractEntityService<T>, route: ActivatedRoute) {
    route.params.takeUntil(this.unsubscribe$).subscribe((params: Params) => {
      if (params['id'] === 'add') {
        this.setMode(Modes.Add);
      } else {
        this.setMode(Modes.View);
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
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe((updated: T) => {
      if (this.takeUpdated) {
        this.entity = updated;
        this.entityBackup = this.entity.copy();
      }
      this.setMode(Modes.View);
    });

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe((created: T) => {
      this.entity = created;
      this.entityBackup = this.entity.copy();
      this.setMode(Modes.View);
    });

    if (this.fetchEntityOnInit && (this.viewMode || this.updateMode)) {
      this.service.getEntity(this.entityId);
    }
  }

  saveOrUpdate(entity: T): void {
    if (this.addMode) {
      this.saveEntity(entity);
      return;
    }

    if (this.updateMode) {
      this.updateEntity(entity);
    }
  }

  saveEntity(entity: T): void {
    this.service.createEntity(entity);
  }

  updateEntity(entity: T): void {
    this.service.updateEntity(entity);
  }

  cancelUpdate(): void {
    this.setMode(Modes.View);
    this.entity = this.entityBackup.copy();
  }

  setMode(mode: Modes): void {
    this.viewMode = mode === Modes.View;
    this.updateMode = mode === Modes.Update;
    this.addMode = mode === Modes.Add;
  }

  protected destroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
