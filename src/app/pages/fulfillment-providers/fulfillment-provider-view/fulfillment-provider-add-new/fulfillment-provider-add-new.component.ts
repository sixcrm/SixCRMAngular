import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FulfillmentProvider} from '../../../../shared/models/fulfillment-provider.model';
import {Modes} from '../../../abstract-entity-view.component';

@Component({
  selector: 'fulfillment-provider-add-new',
  templateUrl: './fulfillment-provider-add-new.component.html',
  styleUrls: ['./fulfillment-provider-add-new.component.scss']
})
export class FulfillmentProviderAddNewComponent implements OnInit {

  @Input() entity: FulfillmentProvider;
  @Input() mode: Modes;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<FulfillmentProvider> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() { }

  ngOnInit() {
  }

  saveProvider(value: boolean): void {
    this.formInvalid = !value;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
