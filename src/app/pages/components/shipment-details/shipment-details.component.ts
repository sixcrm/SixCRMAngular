import {Component, OnInit, Input} from '@angular/core';
import {Products} from '../../../shared/models/products.model';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';

export interface Shipment {
  shippingReceipt: ShippingReceipt,
  products: Products[],
  showDetails?: boolean
}

@Component({
  selector: 'shipment-details',
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.scss']
})
export class ShipmentDetailsComponent implements OnInit {

  @Input() shipment: Shipment;

  constructor() { }

  ngOnInit() {
  }

}
