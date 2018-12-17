import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Order} from '../../../shared/models/order.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Shipment} from '../../components/shipment-details/shipment-details.component';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';

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
    let pending: Shipment = {shippingReceipt: new ShippingReceipt(), products: []};
    let noship: Shipment = {shippingReceipt: null, products: []};

    this._order.products.forEach(products => {
      if (!products.shippingReceipt || !products.shippingReceipt.id) {

        if (products.product.ship) {
          pending.products = [...pending.products, products];
        } else {
          noship.products = [...noship.products, products];
        }

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
      splitted = [...splitted, noship];
    }

    if (pending.products.length > 0) {
      splitted = [...splitted, pending];
    }

    return splitted;
  }

}
