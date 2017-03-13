import {Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Entity} from '../shared/models/entity.interface';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';
import {ProgressBarService} from '../shared/services/progress-bar.service';

export abstract class AbstractEntityComponent<T extends Entity<T>> {

  @Input() set entityId(id: string) {
    if (!this.id || this.id !== id) {
      this.id = id;
      this.loading = true;
      this.service.getEntity(this.id);
    }
  }
  @Input() fullScreen: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('entityContainer') entityContainer;

  entity: T;
  id: string;
  mode: string = 'view';
  showGeneralDetails: boolean = true;
  loading: boolean = false;
  height: string = '55px';

  constructor(protected service: AbstractEntityService<T>, protected progressBarService?: ProgressBarService) { }

  init() {
    this.service.entity$.subscribe((entity: T) => {
      this.entity = entity;
      this.progressBarService.hideTopProgressBar();
      this.loading = false;
      if (this.entityContainer) {
        this.height = this.entityContainer.nativeElement.offsetHeight - 65 + 'px';
      }
    });
  }

  closeDetails(): void {
    this.close.emit(true);
  }

  toggleGeneralDetails(): void {
    this.showGeneralDetails = !this.showGeneralDetails;
  }
}
