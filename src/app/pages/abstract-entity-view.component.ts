import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityService} from '../entity-services/services/abstract-entity.service';
import {AsyncSubject} from 'rxjs';
import {Entity} from '../shared/models/entity.interface';
import {isAllowedNumeric, isAllowedFloatNumeric, isAllowedCurrency, isAllowedEmail} from '../shared/utils/form.utils';
import {getCurrencyMask} from '../shared/utils/mask.utils';

export enum Modes {
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
  isFloatNumeric = isAllowedFloatNumeric;

  protected isInited: boolean = false;
  protected takeUpdated: boolean = true;
  protected fetchEntityOnInit: boolean = true;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(public service: AbstractEntityService<T>, public route: ActivatedRoute) {
    route.params.takeUntil(this.unsubscribe$).subscribe((params: Params) => {
      if (params['id'] === 'add') {
        this.setMode(Modes.Add);
      } else {
        this.setMode(Modes.View);
        this.entityId = params['id'];

        if (this.isInited) {
          this.fetchData();
        }
      }
    });

    route.queryParams.takeUntil(this.unsubscribe$).subscribe((queryParams: Params) => {
      if (queryParams['edit'] === 'true') {
        this.setMode(Modes.Update);
      }
    })
  }

  protected init(notFound?: () => void): void {
    this.isInited = true;

    this.service.entity$.takeUntil(this.unsubscribe$).subscribe((entity: T) => {
      if (notFound && (!entity || !entity.id)) {
        notFound();
      }

      this.entity = entity;
      this.entityBackup = entity.copy();
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe((updated: T) => {
      this.onEntityUpdated(updated);
    });

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe((created: T) => {
      this.entity = created;
      this.entityBackup = this.entity.copy();
      this.setMode(Modes.View);
    });

    this.fetchData();
  }

  protected onEntityUpdated(updated: T) {
    if (this.takeUpdated) {
      this.entity = updated;
      this.entityBackup = this.entity.copy();
    }
    this.setMode(Modes.View);
  }

  protected fetchData() {
    if (this.fetchEntityOnInit && (this.viewMode || this.updateMode)) {
      this.entity = null;
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

  updateEntity(entity: T, options?: {ignoreSnack?: boolean, ignoreProgress?: boolean, ignorePermissions?: boolean}): void {
    this.service.updateEntity(entity, options);
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

  canBeDeactivated(): boolean {
    if (this.viewMode) return true;
    if (this.updateMode || this.addMode) return this.checkIfChanged();

    return true;
  }

  checkIfChanged(): boolean {
    let original = this.entity.copy();
    let backup = this.entityBackup.copy();

    if (original['createdAt']) {
      delete original['createdAt'];
      delete backup['createdAt'];
    }

    if (this.entity['updatedAt']) {
      delete original['updatedAt'];
      delete backup['updatedAt'];
    }

    const originalString = JSON.stringify(original);
    const backupString = JSON.stringify(backup);

    return originalString === backupString;
  }

  protected destroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
