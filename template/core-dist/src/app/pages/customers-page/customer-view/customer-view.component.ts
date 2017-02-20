import {Component, OnInit, OnDestroy} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {CustomersService} from '../../../shared/services/customers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent extends AbstractEntityViewComponent<Customer> implements OnInit, OnDestroy {

  constructor(private customersService: CustomersService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(customersService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new Customer();
    }

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
