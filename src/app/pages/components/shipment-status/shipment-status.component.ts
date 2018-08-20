import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';

@Component({
  selector: 'shipment-status',
  templateUrl: './shipment-status.component.html',
  styleUrls: ['./shipment-status.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class ShipmentStatusComponent implements OnInit {

  @Input() shippingReceipt: ShippingReceipt;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.close.emit(true);
    }
  }

}
