import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from "../../../shared/services/customers.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Customer} from '../../../shared/models/customer.model';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

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
    activatedRoute: ActivatedRoute
  ) {
    super(customersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Customer();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('CUSTOMER_INDEX_HEADER_ID', (e: Customer) => e.id).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_FIRSTNAME', (e: Customer) => e.firstName),
      new ColumnParams('CUSTOMER_INDEX_HEADER_LASTNAME',(e: Customer) => e.lastName),
      new ColumnParams('CUSTOMER_INDEX_HEADER_EMAIL',(e: Customer) => e.email).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_PHONE',(e: Customer) => e.phone).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_COUNTRY',(e: Customer) => e.address.country).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_STATE', (e: Customer) => e.address.state),
      new ColumnParams('CUSTOMER_INDEX_HEADER_CITY', (e: Customer) => e.address.city),
      new ColumnParams('CUSTOMER_INDEX_HEADER_ZIP',(e: Customer) => e.address.zip).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_LINE1',(e: Customer) => e.address.line1).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_CREATED', (e: Customer) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_UPDATED', (e: Customer) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
