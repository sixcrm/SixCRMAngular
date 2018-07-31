import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from "../../../entity-services/services/customers.service";
import {Customer} from '../../../shared/models/customer.model';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {utc} from 'moment';
import {CustomerFiltersDialogComponent} from '../../../dialog-modals/customer-filters-dialog/customer-filters-dialog.component';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityReportIndexComponent<Customer> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'CUSTOMER_INDEX_TITLE'}];
  customers: Customer[] = [];

  constructor(
    protected service: CustomersService,
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
  ) {
    super(auth, dialog, router);

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

    this.date = {start: utc().subtract(1,'M'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Active', selected: false, visible: true},
      {label: 'Partial', selected: false, visible: true},
      {label: 'Blacklisted', selected: false, visible: true}
    ];

    this.options = ['View'];
  }

  ngOnInit() {
    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(customers => {
      if (customers instanceof CustomServerError) {
        this.customers = [];
        return;
      }

      this.customers = customers;
    });

    this.service.getEntities(20);
  }

  ngOnDestroy() {
    this.destroy();
  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/customers', option.item.id]);
        break;
      }
    }
  }

  openFiltersDialog() {
    super.openFiltersDialog(CustomerFiltersDialogComponent);
  }


}
