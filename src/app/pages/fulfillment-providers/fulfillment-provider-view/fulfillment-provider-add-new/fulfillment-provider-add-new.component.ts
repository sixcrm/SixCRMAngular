import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FulfillmentProvider} from '../../../../shared/models/fulfillment-provider.model';
import {Modes} from '../../../abstract-entity-view.component';

@Component({
  selector: 'fulfillment-provider-add-new',
  templateUrl: './fulfillment-provider-add-new.component.html',
  styleUrls: ['./fulfillment-provider-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class FulfillmentProviderAddNewComponent implements OnInit {

  @Input() entity: FulfillmentProvider;
  @Input() mode: Modes;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<FulfillmentProvider> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;
  providers = ['iShip Solutions', 'ThreePL', 'ShipStation', 'Test'];

  constructor() { }

  ngOnInit() {
    if (this.entity.provider.name === 'Hashtag') {
      this.entity.provider.name = 'iShip Solutions'
    }
  }

  enterEditMode() {
    this.changeMode.emit(this.modes.Update);
  }

  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }

  isNotANumber(value) {
    return isNaN(value);
  }

  saveProvider(value: boolean): void {
    this.formInvalid = !value || !this.entity.provider.name
      || (this.entity.provider.name === 'ShipStation' && this.isNotANumber(this.entity.provider.storeId))
      || (this.entity.provider.name === 'ThreePL' && (this.isNotANumber(this.entity.provider.threeplCustomerId) || this.isNotANumber(this.entity.provider.threeplId) || this.isNotANumber(this.entity.provider.threeplFacilityId)));
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
