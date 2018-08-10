import {Component, OnInit, OnDestroy} from '@angular/core';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {utc} from 'moment';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends AbstractEntityReportIndexComponent<any> implements OnInit, OnDestroy  {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Orders'}];

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router
  ) {
    super(auth, dialog, router);

    this.columnParams = [
      new ColumnParams('Status', (e: any) => ''),
      new ColumnParams('Date', (e: any) => '').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Sale Amount', (e: any) => ''),
      new ColumnParams('Items', (e: any) => ''),
      new ColumnParams('Returns', (e: any) => ''),
      new ColumnParams('Refunds', (e: any) => ''),
      new ColumnParams('Chargebacks', (e: any) => ''),
      new ColumnParams('Total', (e: any) => ''),
      new ColumnParams('Order ID', (e: any) => ''),
      new ColumnParams('Order Campaign', (e: any) => ''),
      new ColumnParams('Type', (e: any) => ''),
      new ColumnParams('Customer', (e: any) => '')
    ];

    this.date = {start: utc().subtract(7,'d'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true, count: Observable.of(0)},
      {label: 'Shipped', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Closed', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Errors', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Refunds', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Returns', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Chargebacks', selected: false, visible: true, count: Observable.of(0)}
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
        this.router.navigate(['/customers/advanced'], {queryParams: {order: option.item.id}});
        break;
      }
    }
  }

  openFiltersDialog() {

  }

}
