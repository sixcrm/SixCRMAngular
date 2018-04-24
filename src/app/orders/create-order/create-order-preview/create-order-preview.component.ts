import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {utc} from 'moment';
import {Address} from '../../../shared/models/address.model';
import {Customer} from '../../../shared/models/customer.model';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Product} from '../../../shared/models/product.model';

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

  utcf = utc;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

}
