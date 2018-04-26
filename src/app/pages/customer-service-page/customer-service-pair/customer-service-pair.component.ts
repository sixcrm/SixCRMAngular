import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Customer} from '../../../shared/models/customer.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {CustomersService} from '../../../shared/services/customers.service';

@Component({
  selector: 'customer-service-pair',
  templateUrl: './customer-service-pair.component.html',
  styleUrls: ['./customer-service-pair.component.scss']
})
export class CustomerServicePairComponent implements OnInit {

  customerId: string;
  sessionId: string;

  customer: Customer;

  constructor(private route: ActivatedRoute, private customersService: CustomersService) { }

  ngOnInit() {
    this.route.queryParams.take(1).subscribe(params => {
      this.customerId = params['customer'];
      this.sessionId = params['session'];

      if (this.customerId) {
        this.customersService.getEntity(this.customerId);
      }
    });

    this.customersService.entity$.take(1).subscribe(customer => {
      if (customer instanceof CustomServerError) {
        return;
      }

      this.customer = customer;
    })
  }

}
