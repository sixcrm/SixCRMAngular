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
      new ColumnParams('Date', (e: TransactionAnalytics) => e.date.tz(f).format('MM/DD/YYYY h:mm A')),
      new ColumnParams('Chargeback', (e: TransactionAnalytics) => e.chargeback ? 'Yes' : 'No'),
      new ColumnParams('Response', (e: TransactionAnalytics) => e.response || '-'),
      new ColumnParams('Amount', (e: TransactionAnalytics) => e.amount.usd()),
      new ColumnParams('Refund', (e: TransactionAnalytics) => e.refund.amount ? e.refund.usd() : '-'),
      new ColumnParams('MID', (e: TransactionAnalytics) => e.merchantProvider || '-'),
      new ColumnParams('Transaction ID', (e: TransactionAnalytics) => e.alias || '-'),
      new ColumnParams('Order ID', (e: TransactionAnalytics) => e.rebillAlias || '-'),
      new ColumnParams('Customer', (e: TransactionAnalytics) => e.customer || '-'),
      new ColumnParams('Session', (e: TransactionAnalytics) => e.sessionAlias || '-')
    ];

    this.date = {start: utc().subtract(7,'d'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Chargebacks', selected: false, visible: true},
      {label: 'Refunds', selected: false, visible: true},
      {label: 'Errors', selected: false, visible: true},
      {label: 'Declines', selected: false, visible: true}
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

      this.transactions = transactions;
    });

    this.refetch();
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

  refetch() {
    this.transactions = [];
    this.loadingData = true;
    this.analyticsService.getTransactions({start: this.date.start.clone().format(), end: this.date.end.clone().format()});
  }

}
