import {Component, OnInit, OnDestroy} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {CustomerFiltersDialogComponent} from '../../../dialog-modals/customer-filters-dialog/customer-filters-dialog.component';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityReportIndexComponent<Customer> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'CUSTOMER_INDEX_TITLE'}];

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router
  ) {
    super(auth, dialog, router);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Status', (e: Customer) => ''),
      new ColumnParams('First Name', (e: Customer) => e.firstName),
      new ColumnParams('Last Name',(e: Customer) => e.lastName),
      new ColumnParams('Email',(e: Customer) => e.email),
      new ColumnParams('Phone',(e: Customer) => e.phone),
      new ColumnParams('City',(e: Customer) => e.address.city),
      new ColumnParams('State', (e: Customer) => e.address.state),
      new ColumnParams('Country', (e: Customer) => e.address.country),
      new ColumnParams('Postal Code',(e: Customer) => e.address.zip),
      new ColumnParams('Created', (e: Customer) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Last Updated', (e: Customer) => e.updatedAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Orders', (e: Customer) => '–'),
      new ColumnParams('Sale Amount', (e: Customer) => '–'),
      new ColumnParams('Returns', (e: Customer) => '–'),
      new ColumnParams('Refunds', (e: Customer) => '–'),
      new ColumnParams('Refund Amount', (e: Customer) => '–'),
    ];

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Active', selected: false, visible: true},
      {label: 'Partial', selected: false, visible: true}
    ];

    this.options = ['View'];
  }


  ngOnInit() {
    this.fetch();
  }

  ngOnDestroy() {
    this.destroy();
  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/customers/advanced'], {queryParams: {customer: option.item.id}});
        break;
      }
    }
  }

  openFiltersDialog() {
    super.openFiltersDialog(CustomerFiltersDialogComponent);
  }

  fetch() {

  }

}
