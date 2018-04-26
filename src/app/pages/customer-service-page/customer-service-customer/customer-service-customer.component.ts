import {Component, OnInit, Input} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';

@Component({
  selector: 'customer-service-customer',
  templateUrl: './customer-service-customer.component.html',
  styleUrls: ['./customer-service-customer.component.scss']
})
export class CustomerServiceCustomerComponent implements OnInit {

  @Input() customer: Customer;

  selectedIndex: number = 0;

  constructor() { }

  ngOnInit() {}

  setIndex(value: number) {
    this.selectedIndex = value;
  }
}
