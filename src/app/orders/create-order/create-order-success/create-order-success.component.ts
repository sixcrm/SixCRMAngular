import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CheckoutResponse} from '../../../shared/models/checkout-response.model';
import {Product} from '../../../shared/models/product.model';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {Address} from '../../../shared/models/address.model';
import {Customer} from '../../../shared/models/customer.model';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {utc} from 'moment';
import {Currency} from '../../../shared/utils/currency/currency';

@Component({
  selector: 'create-order-success',
  templateUrl: './create-order-success.component.html',
  styleUrls: ['./create-order-success.component.scss']
})
export class CreateOrderSuccessComponent implements OnInit {

  @Input() customer: Customer;
  @Input() shippingAddress: Address;
  @Input() creditCard: CreditCard;
  @Input() products: (Product | ProductSchedule)[] = [];
  @Input() shippings: Product[] = [];
  @Input() checkoutResponse: CheckoutResponse;

  @Output() done: EventEmitter<boolean> = new EventEmitter();

  utcf = utc;

  constructor(private router: Router, public authService: AuthenticationService) { }

  ngOnInit() {

  }

  navigateToSession() {
    if (!this.checkoutResponse) return;

    this.router.navigate(['/customers', 'advanced'], { queryParams: { session: this.checkoutResponse.session.id }, fragment: 'watermark' });

    this.done.emit(true);
  }

  getPrice() {
    if (!this.products) return new Currency(0);

    return new Currency(this.products.map(p => {

      if (p instanceof ProductSchedule) {
        return (p.firstSchedulePrice.amount || 0) * p.quantity;
      }

      return (p.defaultPrice.amount || 0) * p.quantity;
    }).reduce((a,b) => a+b, 0));
  }

  getShipping() {
    if (!this.shippings) return new Currency(0);

    return new Currency(this.shippings.map(p => (p.defaultPrice.amount || 0) * p.quantity).reduce((a,b) => a+b, 0));
  }

  getTotal() {
    const p = this.getPrice();
    const s = this.getShipping();

    return new Currency(p.amount + s.amount);
  }
}
