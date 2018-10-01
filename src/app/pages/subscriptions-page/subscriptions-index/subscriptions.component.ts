import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MatDialog} from '@angular/material';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {utc} from 'moment';
import {Observable, Subscription} from 'rxjs';
import {SubscriptionFiltersDialogComponent} from '../../../dialog-modals/subscription-filters-dialog/subscription-filters-dialog.component';
import {SubscriptionAnalytics} from '../../../shared/models/analytics/subscription-analytics.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {downloadJSON, downloadCSV} from '../../../shared/utils/file.utils';

@Component({
  selector: 'subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent extends AbstractEntityReportIndexComponent<SubscriptionAnalytics> implements OnInit, OnDestroy  {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Subscriptions'}];

  sub: Subscription;

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {
    super(auth, dialog, router);

    const f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Date', (e: SubscriptionAnalytics) => e.date.tz(f).format('MM/DD/YY h:mma')).setSortName('datetime').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Alias', (e: SubscriptionAnalytics) => e.alias).setSortName('alias')
        .setLink((e: SubscriptionAnalytics) => `/customers/advanced`)
        .setQueryParams((e: SubscriptionAnalytics) => { return { order: e.id } }),
      new ColumnParams('Status', (e: SubscriptionAnalytics) => e.status).setCapitalize(true).setSortName('status'),
      new ColumnParams('Cycle', (e: SubscriptionAnalytics) => e.cycle + '').setSortName('cycle'),
      new ColumnParams('Interval', (e: SubscriptionAnalytics) => e.interval).setSortName('interval'),
      new ColumnParams('Sale Amount', (e: SubscriptionAnalytics) => e.amount.usd()).setSortName('amount'),
      new ColumnParams('Items', (e: SubscriptionAnalytics) => e.items + '').setSortName('item_count'),
      new ColumnParams('Customer', (e: SubscriptionAnalytics) => e.customerName).setSortName('customer_name')
        .setLink((e: SubscriptionAnalytics) => `/customers/advanced`)
        .setQueryParams((e: SubscriptionAnalytics) => { return { customer: e.customerId } }),
      new ColumnParams('Campaign', (e: SubscriptionAnalytics) => e.campaignName).setSortName('campaign_name')
        .setLink((e: SubscriptionAnalytics) => `/campaigns/${e.campaignId}`)
    ];

    this.defaultDate = {start: utc(), end: utc().add(1,'M')};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Active', selected: false, visible: true, filters: [{facet: 'status', values: ['active']}]},
      {label: 'Inactive', selected: false, visible: true, filters: [{facet: 'status', values: ['inactive']}]},
      {label: 'Canceled', selected: false, visible: true, filters: [{facet: 'status', values: ['canceled']}]}
    ];

    this.options = ['View'];
  }

  ngOnInit() {
    this.route.queryParams.take(1).takeUntil(this.unsubscribe$).subscribe(params => {
      this.parseFiltersFromParams(params);
    })
  }

  parseFiltersFromParams(params: Params): void {
    this.parseParams(params);

    this.fetchData();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.destroy();
  }

  private parseSubscriptionsForDownload(subscriptions: SubscriptionAnalytics[]): any {
    return subscriptions.map(s => {
      return {
        'Date/Time': s.date.format('MM/DD/YYYY h:mm A'),
        'Alias': s.alias,
        'Status': s.status,
        'Amount': s.amount.usd(),
        'Cycle': s.cycle,
        'Interval': s.interval,
        'Items': s.items,
        'Customer': s.customerName,
        'Campaign': s.campaignName,
      };
    });
  }

  download(format: 'csv' | 'json') {
    if (format !== 'csv' && format !== 'json') return;

    this.analyticsService.getSubscriptions(this.getFetchParams(true)).subscribe(subscriptions => {
      if (!subscriptions || subscriptions instanceof CustomServerError) {
        return;
      }

      const parsedSubscriptions = this.parseSubscriptionsForDownload(subscriptions);

      const fileName = `${this.authService.getActiveAccount().name} Subscriptions ${utc().tz(this.authService.getTimezone()).format('MM-DD-YY')}`;

      if (format === 'json') {
        downloadJSON(parsedSubscriptions, fileName);
      } else {
        downloadCSV(parsedSubscriptions, fileName);
      }
    });

  }

  fetch() {
    this.router.navigate(
      ['/subscriptions'],
      {queryParams: this.getQueryParams()}
    );

    this.fetchData();
  }

  fetchData() {
    this.loadingData = true;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.analyticsService.getSubscriptions(this.getFetchParams()).subscribe(subscriptions => {
      this.loadingData = false;

      if (!subscriptions || subscriptions instanceof CustomServerError) {
        this.entities = [];
        return;
      }

      this.entities = [...this.entities, ...subscriptions];
      this.hasMore = subscriptions.length === this.limit;
    });

    this.fetchCounts()
  }

  fetchCounts() {
    if (!this.shouldFetchCounts()) return;

    this.prepareFetchCounts();

    this.analyticsService.getSubscriptions({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format()
    }).subscribe(subscriptions => {
      if (subscriptions instanceof CustomServerError) {
        return;
      }

      this.tabs[0].count = Observable.of(subscriptions.length);
      this.tabs[1].count = Observable.of(subscriptions.filter(t=>t.status === 'active').length);
      this.tabs[2].count = Observable.of(subscriptions.filter(t=>t.status === 'inactive').length);
      this.tabs[3].count = Observable.of(subscriptions.filter(t=>t.status === 'canceled').length);
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
    super.openFiltersDialog(SubscriptionFiltersDialogComponent);
  }

}

