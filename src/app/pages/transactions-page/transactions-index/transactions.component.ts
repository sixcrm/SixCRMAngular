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

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends AbstractEntityReportIndexComponent<TransactionAnalytics> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'TRANSACTION_INDEX_TITLE'}];
  transactions: TransactionAnalytics[] = [];

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
      new ColumnParams('Date', (e: TransactionAnalytics) => e.date.tz(f).format('MM/DD/YYYY h:mm A')).setSortName('datetime').setSortApplied(true).setSortOrder('desc'),
      new ColumnParams('Chargeback', (e: TransactionAnalytics) => e.chargeback ? 'Yes' : 'No').setSortName('chargeback'),
      new ColumnParams('Response', (e: TransactionAnalytics) => e.response || '-').setSortName('response'),
      new ColumnParams('Amount', (e: TransactionAnalytics) => e.amount.usd()).setSortName('amount'),
      new ColumnParams('Refund', (e: TransactionAnalytics) => e.refund.amount ? e.refund.usd() : '-').setSortName('refund'),
      new ColumnParams('MID', (e: TransactionAnalytics) => e.merchantProvider || '-').setSortName('merchant_provider_name').setClickable(true),
      new ColumnParams('Transaction ID', (e: TransactionAnalytics) => e.alias || '-').setSortName('alias').setClickable(true),
      new ColumnParams('Order ID', (e: TransactionAnalytics) => e.rebillAlias || '-').setSortName('rebill_alias').setClickable(true),
      new ColumnParams('Customer', (e: TransactionAnalytics) => e.customer || '-').setSortName('customer_name').setClickable(true),
      new ColumnParams('Session', (e: TransactionAnalytics) => e.sessionAlias || '-').setSortName('session_alias').setClickable(true)
    ];

    this.date = {start: utc().subtract(7,'d'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Chargebacks', selected: false, visible: true, filters: [{facet: 'chargeback', values: ['yes']}]},
      {label: 'Refunds', selected: false, visible: true, filters: [{facet: 'response', values: ['refund']}]},
      {label: 'Errors', selected: false, visible: true, filters: [{facet: 'response', values: ['error']}]},
      {label: 'Declines', selected: false, visible: true, filters: [{facet: 'response', values: ['decline']}]}
    ];

    this.options = ['View'];
  }

  ngOnInit() {
    this.analyticsService.transactions$.takeUntil(this.unsubscribe$).subscribe(transactions => {
      this.loadingData = false;

      if (!transactions || transactions instanceof CustomServerError) {
        this.transactions = [];
        return;
      }

      this.transactions = [...this.transactions, ...transactions];
      this.hasMore = transactions.length === this.limit;
    });

    this.fetch();
  }

  ngOnDestroy() {
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

  getSortColumn(): ColumnParams<TransactionAnalytics> {
    for (let i = 0; i < this.columnParams.length; i++) {
      if (this.columnParams[i].sortApplied) {
        return this.columnParams[i];
      }
    }

    return this.columnParams[1];
  }

  refetch() {
    this.hasMore = true;
    this.transactions = [];
    this.fetch();
  }

  getFacets(): {facet: string, values: string[]}[] {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].selected && this.tabs[i].visible) {
        return this.tabs[i].filters;
      }
    }

    return this.filters || [];
  }

  fetch() {
    this.loadingData = true;

    this.analyticsService.getTransactions({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      limit: 25,
      offset: this.transactions.length,
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    });
  }

  cellClicked(event: {item: TransactionAnalytics, param: ColumnParams<TransactionAnalytics>}) {
    switch (event.param.label) {
      case 'MID': {
        this.router.navigate(['/merchantproviders', event.item.merchantProviderId]);
        break;
      }
      case 'Transaction ID': {
        this.router.navigate(['/transactions', event.item.id]);
        break;
      }
      case 'Order ID': {
        this.router.navigate(['/rebills', event.item.rebillId]);
        break;
      }
      case 'Customer': {
        this.router.navigate(['/customers', event.item.customerId]);
        break;
      }
      case 'Session': {
        this.router.navigate(['/sessions', event.item.sessionId]);
        break;
      }
    }
  }

}
