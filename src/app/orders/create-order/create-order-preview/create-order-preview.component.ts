import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {utc} from 'moment';
import {Address} from '../../../shared/models/address.model';
import {Customer} from '../../../shared/models/customer.model';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Product} from '../../../shared/models/product.model';
import {Currency} from '../../../shared/utils/currency/currency';

@Component({
  selector: 'create-order-preview',
  templateUrl: './create-order-preview.component.html',
  styleUrls: ['./create-order-preview.component.scss']
})
export class CreateOrderPreviewComponent implements OnInit {

  @Input() customer: Customer;
  @Input() shippingAddress: Address;
  @Input() creditCard: CreditCard;
  @Input() products: (Product | ProductSchedule)[] = [];
  @Input() shippings: Product[] = [];

  @Output() confirm: EventEmitter<boolean> = new EventEmitter();

  utcf = utc;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

  getPrice() {
    if (!this.products) return new Currency(0);

    return new Currency(this.products.map(p => {

      if (p instanceof ProductSchedule) {
        return (p.getInitialPrice().amount || 0) * p.quantity;
      }

      return (p.defaultPrice.amount || 0) * p.quantity;
    }).reduce((a,b) => a+b, 0));
  }

  getShipping() {
    const fromShippings = this.shippings ?
      this.shippings.map(p => (p.defaultPrice.amount || 0) * p.quantity).reduce((a, b) => a + b, 0)
      : 0;

    const fromSchedules = this.products
      .map(product => product instanceof ProductSchedule ? product.quantity * product.initialCycleSchedulesShippingPrice.amount : 0)
      .reduce((a, b) => a + b, 0);

    return new Currency(fromShippings + fromSchedules);
  }

  getTotal() {
    const p = this.getPrice();
    const s = this.getShipping();

    return new Currency(p.amount + s.amount);
  }

  confirmationRequired() {
    return false;
  }

  getSku(product: Product | ProductSchedule) {
    if (product instanceof ProductSchedule) {
      return product.getInitialSku() || '-';
    }

    return product.sku || '-';
  }
}
