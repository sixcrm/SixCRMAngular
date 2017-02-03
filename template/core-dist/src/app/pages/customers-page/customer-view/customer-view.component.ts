import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {CustomersService} from '../../../shared/services/customers.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {

  private customer: Customer;

  constructor(private customersService: CustomersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.customersService.customer$.subscribe((customer: Customer) => {
      this.customer = customer;
    });
    this.route.params.subscribe((params: Params) => {
      this.customersService.getCustomer(params['id']);
    });
  }
}
