import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {utc} from 'moment';
import {Observable} from 'rxjs';
import {ShippingreceiptFiltersDialogComponent} from '../../../dialog-modals/shippingreceipt-filters-dialog/shippingreceipt-filters-dialog.component';

@Component({
  selector: 'shipping-receipt',
  templateUrl: './shipping-receipts.component.html',
  styleUrls: ['./shipping-receipts.component.scss']
})
export class ShippingReceiptsComponent extends AbstractEntityReportIndexComponent<any> implements OnInit, OnDestroy  {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Shipping Receipts'}];

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router
  ) {
    super(auth, dialog, router);

    this.columnParams = [
      new ColumnParams('Status', (e: any) => ''),
      new ColumnParams('Date Created', (e: any) => '').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Delivered', (e: any) => ''),
      new ColumnParams('Fulfillment', (e: any) => ''),
      new ColumnParams('Tracking ID', (e: any) => ''),
      new ColumnParams('Order ID', (e: any) => ''),
      new ColumnParams('Customer', (e: any) => ''),
      new ColumnParams('Delivery Address', (e: any) => '')
    ];

    this.date = {start: utc().subtract(7,'d'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true, count: Observable.of(0)},
      {label: 'Pending', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Shipped', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Delivered', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Errors', selected: false, visible: true, count: Observable.of(0)}
    ];

    this.options = ['View'];
  }

  ngOnInit() {
    this.fetch();
  }

  ngOnDestroy() {
    this.destroy();
  }

  fetch() {

  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/shippingreceipts', option.item.id]);
        break;
      }
    }
  }

  openFiltersDialog() {
    super.openFiltersDialog(ShippingreceiptFiltersDialogComponent);
  }

}