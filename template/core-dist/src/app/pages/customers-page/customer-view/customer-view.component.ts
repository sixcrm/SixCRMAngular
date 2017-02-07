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
    this.customersService.entity$.subscribe((data) => this.customer = data);
    this.route.params.subscribe((params: Params) => this.customersService.getEntity(params['id']));
  }
}
