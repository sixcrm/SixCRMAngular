import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
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
import {Subscription} from 'rxjs';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends AbstractEntityReportIndexComponent<TransactionAnalytics> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'TRANSACTION_INDEX_TITLE'}];
  transactions: TransactionAnalytics[] = [];

  sub: Subscription;

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
    public featuresFlagService: FeatureFlagService,
    private analyticsService: AnalyticsService
  ) {
    super(auth, dialog, router);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Date', (e: TransactionAnalytics) => e.date.tz(f).format('MM/DD/YY h:mma')).setSortName('datetime').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Chargeback', (e: TransactionAnalytics) => e.chargeback ? 'Yes' : '–').setSortName('chargeback'),
      new ColumnParams('Response', (e: TransactionAnalytics) => e.response)
        .setSortName('response')
        .setCapitalize(true)
        .setMaterialIconMapper((e: TransactionAnalytics) => e.response === 'success' ? 'done' : e.response === 'decline' ? 'block' : 'error')
        .setMaterialIconBackgroundColorMapper((e: TransactionAnalytics) => e.response === 'success' ? '#1EBEA5' : '#ffffff')
        .setMaterialIconColorMapper((e: TransactionAnalytics) => e.response === 'success' ? '#ffffff' : '#DC2547'),
      new ColumnParams('Amount', (e: TransactionAnalytics) => e.amount.usd()).setSortName('amount'),
      new ColumnParams('Refund', (e: TransactionAnalytics) => e.refund.amount ? e.refund.usd() : '–').setSortName('refund'),
      new ColumnParams('MID', (e: TransactionAnalytics) => e.merchantProvider)
        .setSortName('merchant_provider_name')
        .setLink((e: TransactionAnalytics) => `/merchantproviders/${e.merchantProviderId}`),
      new ColumnParams('Transaction ID', (e: TransactionAnalytics) => e.alias)
        .setSortName('alias')
        .setLink((e: TransactionAnalytics) => `/transactions/${e.id}`),
      new ColumnParams('Order ID', (e: TransactionAnalytics) => e.rebillAlias)
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
      {label: 'Chargebacks', selected: false, visible: true, filters: [{facet: 'chargeback', values: ['yes']}]},
      {label: 'Refunds', selected: false, visible: true, filters: [{facet: 'transactionType', values: ['refund']}]},
      {label: 'Errors', selected: false, visible: true, filters: [{facet: 'response', values: ['error']}]},
      {label: 'Declines', selected: false, visible: true, filters: [{facet: 'response', values: ['decline']}]}
    ];

    this.options = ['View'];
  }

  ngOnInit() {
    this.fetch();
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
        this.router.navigate(['/transactions', option.item.id]);
        break;
      }
    }
  }

  openFiltersDialog() {
    super.openFiltersDialog(TransactionFiltersDialogComponent);
  }

  fetch() {
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
  }

}
