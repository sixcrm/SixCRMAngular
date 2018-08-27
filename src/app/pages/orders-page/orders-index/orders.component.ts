import {Component, OnInit, OnDestroy} from '@angular/core';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MatDialog} from '@angular/material';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {utc} from 'moment';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {Observable, Subscription} from 'rxjs';
import {OrderFiltersDialogComponent} from '../../../dialog-modals/order-filters-dialog/order-filters-dialog.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {OrderAnalytics} from '../../../shared/models/analytics/order-analytics.model';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends AbstractEntityReportIndexComponent<OrderAnalytics> implements OnInit, OnDestroy  {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Orders'}];

  sub: Subscription;

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
    private analyticsService: AnalyticsService,
    private route: ActivatedRoute
  ) {
    super(auth, dialog, router);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Date', (e: OrderAnalytics) => e.date.tz(f).format('MM/DD/YY h:mma')).setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Status', (e: OrderAnalytics) => '–'),
      new ColumnParams('Sale Amount', (e: OrderAnalytics) => e.amount.usd()),
      new ColumnParams('Items', (e: OrderAnalytics) => e.items),
      new ColumnParams('Returns', (e: OrderAnalytics) => e.returns || '–'),
      new ColumnParams('Refunds', (e: OrderAnalytics) => e.refunds ? e.refunds.usd() : '–'),
      new ColumnParams('Chargebacks', (e: OrderAnalytics) => e.chargebacks ? e.chargebacks.usd() : '–'),
      new ColumnParams('Total', (e: OrderAnalytics) => e.total.usd()),
      new ColumnParams('Order ID', (e: OrderAnalytics) => e.alias || '–'),
      new ColumnParams('Order Campaign', (e: OrderAnalytics) => e.campaignName || '–'),
      new ColumnParams('Type', (e: OrderAnalytics) => e.type || '–'),
      new ColumnParams('Customer', (e: OrderAnalytics) => e.customerName || '–')
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
    this.route.queryParams.take(1).takeUntil(this.unsubscribe$).subscribe(params => {
      this.parseFiltersFromParams(params);
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.destroy();
  }

  parseFiltersFromParams(params: Params): void {
    this.parseParams(params);

    this.fetchData();
  }

  fetch() {
    this.router.navigate(
      ['/orders'],
      {
        queryParams: {
          start: this.date.start.clone().format(),
          end: this.date.end.clone().format(),
          sort: this.getSortColumn().sortName,
          sortOrder: this.getSortColumn().sortOrder,
          tab: this.getSelectedTab() ? this.getSelectedTab().label : '',
          filters: JSON.stringify(this.filters)
        }
      });

    this.fetchData();
  }

  fetchData() {
    this.loadingData = true;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.analyticsService.getOrders({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      limit: 25,
      offset: this.entities.length,
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(orders => {
      this.loadingData = false;

      if (!orders || orders instanceof CustomServerError) {
        this.entities = [];
        return;
      }

      this.entities = [...this.entities, ...orders];
      this.hasMore = orders.length === this.limit;
    });
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
    super.openFiltersDialog(OrderFiltersDialogComponent);
  }

}
