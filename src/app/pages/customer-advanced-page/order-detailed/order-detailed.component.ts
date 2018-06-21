import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Order} from '../../../shared/models/order.model';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {Products} from '../../../shared/models/products.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';

interface Shipment {
  shippingReceipt: ShippingReceipt,
  products: Products[]
}

@Component({
  selector: 'order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {

  _order: Order;
  shipments: Shipment[] = [];

  @Input() set order(value: Order) {
    this._order = value;

    if (this._order) {
      this.shipments = this.splitByShipment();
    }
  };

  @Output() backButtonSelected: EventEmitter<boolean> = new EventEmitter();

  @Output() refund: EventEmitter<Order> = new EventEmitter();
  @Output() ret: EventEmitter<Order> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  splitByShipment(): Shipment[] {
    let splitted: Shipment[] = [];
    let noship: Shipment = {shippingReceipt: null, products: []};

    this._order.products.forEach(products => {
      if (!products.shippingReceipt || !products.shippingReceipt.id) {
        noship.products = [...noship.products, products];
      } else {
        const index = firstIndexOf(splitted, (el) => el.shippingReceipt.id === products.shippingReceipt.id);

        if (index !== -1) {
          splitted[index].products = [...splitted[index].products, products];
        } else {
          splitted = [...splitted, {shippingReceipt: products.shippingReceipt.copy(), products: [products]}]
        }
      }
    });

    if (noship.products.length > 0) {
      return [...splitted, noship];
    }

    return splitted;
  }

}