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
import {downloadJSON, downloadCSV} from '../../../shared/utils/file.utils';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends AbstractEntityReportIndexComponent<OrderAnalytics> implements OnInit, OnDestroy  {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Orders', url: '/orders'}];

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
      new ColumnParams('Date', (e: OrderAnalytics) => e.date.tz(f).format('MM/DD/YY h:mma')).setSortName('datetime').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Status', (e: OrderAnalytics) => e.status || '–').setSortName('status').setCapitalize(true),
      new ColumnParams('Type', (e: OrderAnalytics) => e.type || '–').setSortName('type').setCapitalize(true),
      new ColumnParams('Sale Amount', (e: OrderAnalytics) => e.amount.usd()).setSortName('amount'),
      new ColumnParams('Items', (e: OrderAnalytics) => e.items).setSortName('items'),
      new ColumnParams('Returns', (e: OrderAnalytics) => e.returns || '–').setSortName('returns'),
      new ColumnParams('Refunds', (e: OrderAnalytics) => e.refunds.amount ? e.refunds.usd() : '–')
        .setSortName('refunds')
        .setColorMapper((e: OrderAnalytics) => e.refunds.amount ? '#E35871' : 'black'),
      new ColumnParams('Total', (e: OrderAnalytics) => e.total.usd()).setSortName('total'),
      new ColumnParams('Order Alias', (e: OrderAnalytics) => e.alias || '–')
        .setSortName('alias')
        .setLink((e: OrderAnalytics) => `/customers/advanced`)
        .setQueryParams((e: OrderAnalytics) => { return { order: e.id } }),
      new ColumnParams('Order Campaign', (e: OrderAnalytics) => e.campaignName || '–')
        .setSortName('campaign_name')
        .setLink((e: OrderAnalytics) => `/campaigns/${e.campaign}`),
      new ColumnParams('Customer', (e: OrderAnalytics) => e.customerName || '–')
        .setSortName('customer_name')
        .setLink((e: OrderAnalytics) => `/customers/advanced`)
        .setQueryParams((e: OrderAnalytics) => { return { customer: e.customer } })
    ];

    this.tabs = [
      {label: 'All', selected: true, visible: true, count: Observable.of(0)},
      {label: 'Shipped', selected: false, visible: true, count: Observable.of(0), filters: [{facet: 'orderStatus', values: ['shipped']}]},
      {label: 'Closed', selected: false, visible: true, count: Observable.of(0), filters: [{facet: 'orderStatus', values: ['processed', 'delivered']}]},
      {label: 'Error', selected: false, visible: true, count: Observable.of(0), filters: [{facet: 'orderStatus', values: ['error']}]}
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

  private parseOrdersForDownload(orders: OrderAnalytics[]): any {
    return orders.map(o => {
      return {
        'Date/Time': o.date.format('MM/DD/YYYY h:mm A'),
        'Status': o.status || '-',
        'Type': o.type,
        'Sale Amount': o.amount.usd(),
        'Items': o.items,
        'Returns': o.returns ? o.returns : '-',
        'Refunds': o.refunds.amount ? o.refunds.usd() : '-',
        'Total': o.total.usd(),
        'Order Alias': o.alias,
        'Campaign': o.campaignName,
        'Customer': o.customerName
      };
    });
  }

  download(format: 'csv' | 'json') {
    if (format !== 'csv' && format !== 'json') return;

    this.analyticsService.getOrders(this.getFetchParams(true)).subscribe(orders => {
      if (!orders || orders instanceof CustomServerError) {
        return;
      }

      const parsedOrders = this.parseOrdersForDownload(orders);

      const fileName = `${this.authService.getActiveAccount().name} Orders ${utc().tz(this.authService.getTimezone()).format('MM-DD-YY')}`;

      if (format === 'json') {
        downloadJSON(parsedOrders, fileName);
      } else {
        downloadCSV(parsedOrders, fileName);
      }
    });

  }

  fetch() {
    this.router.navigate(
      ['/orders'],
      {queryParams: this.getQueryParams()}
    );

    this.fetchData();
  }

  fetchData() {
    this.loadingData = true;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.analyticsService.getOrders(this.getFetchParams()).subscribe(orders => {
      this.loadingData = false;

      if (!orders || orders instanceof CustomServerError) {
        this.entities = [];
        return;
      }

      this.entities = [...this.entities, ...orders];
      this.hasMore = orders.length === this.limit;
    });

    this.fetchCounts();
  }

  fetchCounts() {
    if (!this.shouldFetchCounts()) return;

    this.prepareFetchCounts();

    this.analyticsService.getOrders({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format()
    }).subscribe(orders => {
      if (orders instanceof CustomServerError) {
        return;
      }

      this.tabs[0].count = Observable.of(orders.length);
      this.tabs[1].count = Observable.of(orders.filter(o => o.status === 'shipped').length);
      this.tabs[2].count = Observable.of(orders.filter(o => o.status === 'processed' || o.status === 'delivered').length);
      this.tabs[3].count = Observable.of(orders.filter(o => o.status.indexOf('error') !== -1).length);
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
