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

    const order: Order = this._order.copy();
    order.transactions.map(transaction => {
      transaction.products = transaction.products.map(products => {
        if (products.isCycleProduct) {
          products.product.ship = products.isShipping;
        }

        return products;
      });

      return transaction;
    });

    const noshipCycleProducts =
      order.rebill.transactions
        .map(transaction => transaction.products)
        .reduce((a,b) => [...a, ...b], [])
        .filter(products => products.isCycleProduct && !products.isShipping);

    const failedProducts =
      order.rebill.transactions
        .filter(t => !t.isSuccess())
        .map(t => t.products)
        .reduce((a,b) => [...a, ...b], []);

    order
      .products
      .forEach(products => {
        if (failedProducts.find(fp =>
          fp.product.id === products.product.id
          && fp.amount.amount === products.amount.amount
          && fp.shippingReceipt.id === products.shippingReceipt.id)
        ) {
          noship.products = [...noship.products, products];

          return;
        }

        if (noshipCycleProducts.find(nsp =>
          nsp.product.id === products.product.id
          && nsp.amount.amount === products.amount.amount)
        ) {
          noship.products = [...noship.products, products];

          return;
        }

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
