import {Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Entity} from '../shared/models/entity.interface';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {ProgressBarService} from '../shared/services/progress-bar.service';

export abstract class AbstractEntityComponent<T extends Entity<T>> {

  @Input() set entityId(id: string) {
    if (!id) {
      if (this.newEntity) {
        this.entity = this.newEntity();
      }

      setTimeout(() => this.calculateContainerHeight(), 1);
      return;
    }

    if (!this.id || this.id !== id) {
      this.id = id;
      this.loading = true;
      this.service.getEntity(this.id);
    }
  }
  @Input() fullScreen: boolean;
  @Input() mode: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteEntity: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('entityContainer') entityContainer;

  entity: T;
  entityCopy: T;
  id: string;
  loading: boolean = false;
  height: string = '55px';
  tabIndex: number = 0;

  constructor(
    protected service: AbstractEntityService<T>,
    protected progressBarService?: ProgressBarService,
    protected newEntity?: () => T
  ) { }

  init() {
    this.service.entity$.subscribe((entity: T) => {
      this.entity = entity;
      this.entityCopy = this.entity.copy();
      this.progressBarService.hideTopProgressBar();
      this.loading = false;
      this.calculateContainerHeight();
    });

    this.service.entityUpdated$.subscribe((entity: T) => {
      this.progressBarService.hideTopProgressBar();
      this.entity = entity;
      this.entityCopy = entity.copy();
      this.tabIndex = 0;
    });

    this.service.entityCreated$.subscribe((entity: T) => {
      this.progressBarService.hideTopProgressBar();
      this.entity = entity;
      this.entityCopy = entity.copy();
      this.tabIndex = 0;
      this.mode = 'view';
    });
  }

  closeDetails(): void {
    this.close.emit(true);
  }

  emitDeleteEntity(): void {
    this.deleteEntity.emit(this.id);
  }

  cancelUpdate(): void {
    this.entityCopy = this.entity.copy();
  }

  update(): void {
    if (this.entityCopy.id) {
      this.service.updateEntity(this.entityCopy);
      this.progressBarService.showTopProgressBar();
    }
  }

  create(): void {
    if (this.mode === 'add' && this.entity) {
      this.service.createEntity(this.entity);
      this.progressBarService.showTopProgressBar();
    }
  }

  private calculateContainerHeight(): void {
    if (this.entityContainer) {
      this.height = this.entityContainer.nativeElement.offsetHeight - 67 + 'px';
    }
  }
}
