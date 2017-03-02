import {Input, Output, EventEmitter} from '@angular/core';
import {Entity} from '../shared/models/entity.interface';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {ProgressBarService} from '../shared/services/progress-bar.service';

export abstract class AbstractEntityComponent<T extends Entity<T>> {

  @Input() entityId: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  entity: T;
  mode: string = 'view';
  showGeneralDetails: boolean = true;

  constructor(protected service: AbstractEntityService<T>, protected progressBarService?: ProgressBarService) { }

  init() {
    if (this.entityId) {
      this.service.entity$.subscribe((entity: T) => {
        this.entity = entity;
        this.progressBarService.hideTopProgressBar();
      });

      this.service.getEntity(this.entityId);
    }
  }

  closeDetails(): void {
    this.close.emit(true);
  }

  toggleGeneralDetails(): void {
    this.showGeneralDetails = !this.showGeneralDetails;
  }
}
