import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {FeatureFlagService} from '../../../shared/services/feature-flag.service';
import {utc} from 'moment';
import {TransactionFiltersDialogComponent} from '../../../dialog-modals/transaction-filters-dialog/transaction-filters-dialog.component';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {TransactionAnalytics} from '../../../shared/models/analytics/transaction-analytics.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Subscription, Observable} from 'rxjs';
import {downloadJSON, downloadCSV} from '../../../shared/utils/file.utils';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends AbstractEntityReportIndexComponent<TransactionAnalytics> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'TRANSACTION_INDEX_TITLE', url: '/transactions'}];

  sub: Subscription;

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
    private route: ActivatedRoute,
    public featuresFlagService: FeatureFlagService,
    private analyticsService: AnalyticsService
  ) {
    super(auth, dialog, router);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Date', (e: TransactionAnalytics) => e.date.tz(f).format('MM/DD/YY h:mma')).setSortName('datetime').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Response', (e: TransactionAnalytics) => e.response)
        .setSortName('response')
        .setCapitalize(true)
        .setMaterialIconMapper((e: TransactionAnalytics) => e.response === 'success' ? 'done' : e.response === 'decline' ? 'block' : 'error')
        .setMaterialIconBackgroundColorMapper((e: TransactionAnalytics) => e.response === 'success' ? '#1EBEA5' : '#ffffff')
        .setMaterialIconColorMapper((e: TransactionAnalytics) => e.response === 'success' ? '#ffffff' : '#DC2547'),
      new ColumnParams('Type', (e: TransactionAnalytics) => e.transactionType ? e.transactionType : '–').setSortName('type').setCapitalize(true),
      new ColumnParams('Amount', (e: TransactionAnalytics) => e.amount.amount ? e.amount.usd() : '–').setSortName('amount'),
      new ColumnParams('Refund', (e: TransactionAnalytics) => e.refund.amount ? e.refund.usd() : '–').setSortName('refund'),
      new ColumnParams('MID', (e: TransactionAnalytics) => e.merchantProvider)
        .setSortName('merchant_provider_name')
        .setLink((e: TransactionAnalytics) => `/merchantproviders/${e.merchantProviderId}`),
      new ColumnParams('Transaction Alias', (e: TransactionAnalytics) => e.alias)
        .setSortName('alias')
        .setLink((e: TransactionAnalytics) => `/customers/advanced`)
        .setQueryParams((e: TransactionAnalytics) => { return { transaction: e.id } }),
      new ColumnParams('Order Alias', (e: TransactionAnalytics) => e.rebillAlias)
        .setSortName('rebill_alias')
        .setLink((e: TransactionAnalytics) => `/customers/advanced`)
        .setQueryParams((e: TransactionAnalytics) => { return { order: e.rebillId } }),
      new ColumnParams('Customer', (e: TransactionAnalytics) => e.customer)
        .setSortName('customer_name')
        .setLink((e: TransactionAnalytics) => `/customers/advanced`)
        .setQueryParams((e: TransactionAnalytics) => { return { customer: e.customerId } }),
      new ColumnParams('Session', (e: TransactionAnalytics) => e.sessionAlias)
        .setSortName('session_alias')
        .setLink((e: TransactionAnalytics) => `/customers/advanced`)
        .setQueryParams((e: TransactionAnalytics) => { return { session: e.sessionId } }),
    ];

    this.date = {start: utc().subtract(7,'d'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Refunds', selected: false, visible: true, filters: [{facet: 'transactionType', values: ['refund']}]},
      {label: 'Errors', selected: false, visible: true, filters: [{facet: 'response', values: ['error']}]},
      {label: 'Declines', selected: false, visible: true, filters: [{facet: 'response', values: ['decline']}]}
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

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/customers', 'advanced'], {queryParams: {transaction: option.item.id}});
        break;
      }
    }
  }

  openFiltersDialog() {
    super.openFiltersDialog(TransactionFiltersDialogComponent);
  }

  private parseTransactionsForDownload(transactions: TransactionAnalytics[]): any {
    return transactions.map(t => {
      return {
        'Date/Time': t.date.format('MM/DD/YYYY h:mm A'),
        'Customer': t.customer,
        'Amount': t.amount.usd(),
        'Transaction Alias': t.alias,
        'Order Alias': t.rebillAlias,
        'Session': t.sessionAlias,
        'Response': t.response,
        'MID': t.merchantProvider,
        'Refund': t.refund.amount ? t.refund.usd() : '–'
      };
    });
  }

  download(format: 'csv' | 'json') {
    if (format !== 'csv' && format !== 'json') return;

    this.analyticsService.getTransactions({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(transactions => {
      if (!transactions || transactions instanceof CustomServerError) {
        return;
      }

      const parsedTransactions = this.parseTransactionsForDownload(transactions);

      const fileName = `${this.authService.getActiveAccount().name} Transactions ${utc().tz(this.authService.getTimezone()).format('MM-DD-YY')}`;

      if (format === 'json') {
        downloadJSON(parsedTransactions, fileName);
      } else {
        downloadCSV(parsedTransactions, fileName);
      }
    });

  }

  fetch() {
    this.router.navigate(
      ['/transactions'],
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

    this.sub = this.analyticsService.getTransactions({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      limit: 25,
      offset: this.entities.length,
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(transactions => {
      this.loadingData = false;

      if (!transactions || transactions instanceof CustomServerError) {
        this.entities = [];
        return;
      }

      this.entities = [...this.entities, ...transactions];
      this.hasMore = transactions.length === this.limit;
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

    this.analyticsService.getTransactions({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format()
    }).subscribe(transactions => {
      if (transactions instanceof CustomServerError) {
        return;
      }

      this.tabs[0].count = Observable.of(transactions.length);
      this.tabs[1].count = Observable.of(transactions.filter(t=>t.transactionType === 'refund').length);
      this.tabs[2].count = Observable.of(transactions.filter(t=>t.response === 'error').length);
      this.tabs[3].count = Observable.of(transactions.filter(t=>t.response === 'decline').length);
    });
  }

}
