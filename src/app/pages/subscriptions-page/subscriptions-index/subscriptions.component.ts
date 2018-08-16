import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {utc} from 'moment';
import {Observable} from 'rxjs';
import {SubscriptionFiltersDialogComponent} from '../../../dialog-modals/subscription-filters-dialog/subscription-filters-dialog.component';

@Component({
  selector: 'subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent extends AbstractEntityReportIndexComponent<any> implements OnInit, OnDestroy  {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Subscriptions'}];

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router
  ) {
    super(auth, dialog, router);

    this.columnParams = [
      new ColumnParams('Status', (e: any) => ''),
      new ColumnParams('Date', (e: any) => '').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Cycle', (e: any) => ''),
      new ColumnParams('Interval', (e: any) => ''),
      new ColumnParams('Sale Amount', (e: any) => ''),
      new ColumnParams('Items', (e: any) => ''),
      new ColumnParams('Customer', (e: any) => ''),
      new ColumnParams('Watermark', (e: any) => ''),
      new ColumnParams('Campaign', (e: any) => '')
    ];

    this.date = {start: utc().subtract(7,'d'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true, count: Observable.of(0)},
      {label: 'Active', selected: false, visible: true, count: Observable.of(0)},
      {label: 'Canceled', selected: false, visible: true, count: Observable.of(0)}
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
    super.openFiltersDialog(SubscriptionFiltersDialogComponent);
  }

}

