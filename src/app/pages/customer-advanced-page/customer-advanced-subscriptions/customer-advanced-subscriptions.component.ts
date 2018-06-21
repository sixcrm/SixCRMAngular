import {Component, OnInit, Input} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {Rebill} from '../../../shared/models/rebill.model';
import {RebillsService} from '../../../entity-services/services/rebills.service';

@Component({
  selector: 'customer-advanced-subscriptions',
  templateUrl: './customer-advanced-subscriptions.component.html',
  styleUrls: ['./customer-advanced-subscriptions.component.scss']
})
export class CustomerAdvancedSubscriptionsComponent implements OnInit {

  _customer: Customer;

  rebills: Rebill[] = [];

  loaded: boolean;

  @Input() set customer(customer: Customer) {
    if (customer) {
      const performInit = !this._customer;

      this._customer = customer;

      if (performInit) {
        this.initialize();
      }
    }
  }

  constructor(private rebillService: RebillsService) { }

  ngOnInit() {
  }

  initialize() {
    this.rebillService.getPastRebillsByCustomer(this._customer, {}).subscribe(rebills => {
      this.rebills = rebills;

      this.loaded = true;
    });
  }
}
