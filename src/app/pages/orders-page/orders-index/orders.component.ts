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
      new ColumnParams('Date', (e: OrderAnalytics) => e.date.tz(f).format('MM/DD/YY h:mma')).setSortName('datetime').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Type', (e: OrderAnalytics) => e.type || '–').setSortName('type').setCapitalize(true),
      new ColumnParams('Sale Amount', (e: OrderAnalytics) => e.amount.usd()).setSortName('amount'),
      new ColumnParams('Items', (e: OrderAnalytics) => e.items).setSortName('items'),
      new ColumnParams('Returns', (e: OrderAnalytics) => e.returns || '–').setSortName('returns'),
      new ColumnParams('Refunds', (e: OrderAnalytics) => e.refunds.amount ? e.refunds.usd() : '–').setSortName('refunds'),
      new ColumnParams('Chargebacks', (e: OrderAnalytics) => e.chargebacks.amount ? e.chargebacks.usd() : '–').setSortName('chargebacks'),
      new ColumnParams('Total', (e: OrderAnalytics) => e.total.usd()).setSortName('total'),
      new ColumnParams('Order ID', (e: OrderAnalytics) => e.alias || '–')
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

  private parseOrdersForDownload(orders: OrderAnalytics[]): any {
    return orders.map(o => {
      return {
        'Date/Time': o.date.format('MM/DD/YYYY h:mm A'),
        'Type': o.type,
        'Sale Amount': o.amount.usd(),
        'Items': o.items,
        'Returns': o.returns ? o.returns : '–',
        'Refunds': o.refunds.amount ? o.refunds.usd() : '–',
        'Chargebacks': o.chargebacks.amount ? o.chargebacks.usd() : '–',
        'Total': o.total.usd(),
        'Order ID': o.alias,
        'Campaign': o.campaignName,
        'Customer': o.customerName
      };
    });
  }

  download(format: 'csv' | 'json') {
    if (format !== 'csv' && format !== 'json') return;

    this.analyticsService.getOrders({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(orders => {
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

    this.fetchCounts();
  }

  fetchCounts() {
    if (this.lastCountsDate
      && this.lastCountsDate.start.isSame(this.date.start.clone(), 'd')
      && this.lastCountsDate.end.isSame(this.date.end.clone(), 'd')
    ) {
      return;
    }

    this.lastCountsDate = {
      start: this.date.start.clone(),
      end: this.date.end.clone()
    };

    this.tabs.forEach(t => t.count = Observable.of(null));

    this.analyticsService.getOrders({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format()
    }).subscribe(orders => {
      if (orders instanceof CustomServerError) {
        return;
      }

      this.tabs[0].count = Observable.of(orders.length);
      this.tabs[1].count = Observable.of(0);
      this.tabs[2].count = Observable.of(0);
      this.tabs[3].count = Observable.of(0);
      this.tabs[4].count = Observable.of(orders.filter(o => o.refunds.amount > 0).length);
      this.tabs[5].count = Observable.of(orders.filter(o => o.returns > 0).length);
      this.tabs[6].count = Observable.of(orders.filter(o => o.chargebacks.amount > 0).length);
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
