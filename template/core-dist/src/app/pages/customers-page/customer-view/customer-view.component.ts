import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {CustomersService} from '../../../shared/services/customers.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent extends AbstractEntityViewComponent<Customer> implements OnInit {

  private customer: Customer;

  constructor(private customersService: CustomersService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(customersService, route, progressBarService);
  }

  ngOnInit() {
    this.customersService.entity$.subscribe((data) => {
      this.customer = data;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }
}
