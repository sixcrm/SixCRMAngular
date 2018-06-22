import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';

@Component({
  selector: 'shipment-status',
  templateUrl: './shipment-status.component.html',
  styleUrls: ['./shipment-status.component.scss']
})
export class ShipmentStatusComponent implements OnInit {

  @Input() shippingReceipt: ShippingReceipt;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
