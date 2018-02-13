import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from "../../../shared/services/customers.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Customer} from '../../../shared/models/customer.model';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {UserSettingsService} from '../../../shared/services/user-settings.service';

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
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    userSettingsService: UserSettingsService
  ) {
    super(customersService, auth, dialog, paginationService, router, activatedRoute, userSettingsService);

    this.entityFactory = () => new Customer();

    this.columnParams = [
      new ColumnParams('CUSTOMER_INDEX_HEADER_FIRSTNAME', (e: Customer) => e.firstName),
      new ColumnParams('CUSTOMER_INDEX_HEADER_LASTNAME',(e: Customer) => e.lastName),
      new ColumnParams('CUSTOMER_INDEX_HEADER_STATE', (e: Customer) => e.address.state),
      new ColumnParams('CUSTOMER_INDEX_HEADER_CITY', (e: Customer) => e.address.city)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
