import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from "../../shared/services/customers.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Customer} from '../../shared/models/customer.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityIndexComponent<Customer> implements OnInit, OnDestroy {

  constructor(
    customersService: CustomersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(customersService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('First Name', (e: Customer) => e.firstName),
      new ColumnParams('Last Name',(e: Customer) => e.lastName),
      new ColumnParams('State', (e: Customer) => e.address.state),
      new ColumnParams('City', (e: Customer) => e.address.city)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
