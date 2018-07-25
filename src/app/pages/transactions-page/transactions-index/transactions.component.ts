import {Component, OnInit, OnDestroy} from '@angular/core';
import {TransactionsService} from "../../../entity-services/services/transactions.service";
import {Transaction} from '../../../shared/models/transaction.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {FeatureFlagService} from '../../../shared/services/feature-flag.service';
import {Moment, utc} from 'moment';
import {FilterTableTab} from '../../../shared/components/filter-table/filter-table.component';
import {TransactionFiltersDialogComponent} from '../../../dialog-modals/transaction-filters-dialog/transaction-filters-dialog.component';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends AbstractEntityIndexComponent<Transaction> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'TRANSACTION_INDEX_TITLE'}];

  date: {start: Moment, end: Moment} = {start: utc().subtract(1,'M'), end: utc()};

  tabs: FilterTableTab[] = [
    {label: 'All', selected: true, visible: true},
    {label: 'Chargebacks', selected: false, visible: true},
    {label: 'Refunds', selected: false, visible: true},
    {label: 'Errors', selected: false, visible: true},
    {label: 'Declines', selected: false, visible: true}
  ];

  options = ['View'];

  constructor(
    transactionsService: TransactionsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    public featuresFlagService: FeatureFlagService
  ) {
    super(transactionsService, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('TRANSACTION_INDEX_HEADER_ID', (e: Transaction) => e.id).setSelected(false),
      new ColumnParams('TRANSACTION_INDEX_HEADER_ALIAS', (e: Transaction) => e.alias),
      new ColumnParams('TRANSACTION_INDEX_HEADER_AMOUNT', (e: Transaction) => e.amount.usd(), 'right').setNumberOption(true),
      new ColumnParams('TRANSACTION_INDEX_HEADER_RESPONSE', (e: Transaction) => e.processorResponse.message),
      new ColumnParams('TRANSACTION_INDEX_HEADER_PROCESSOR', (e: Transaction) => e.merchantProvider.name),
      new ColumnParams('TRANSACTION_INDEX_HEADER_CREATED',(e: Transaction) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('TRANSACTION_INDEX_HEADER_UPDATED',(e: Transaction) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.shareLimit = false;
    this.limit = 25;
    this.setInfiniteScroll(true);

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  selectTab(tab: FilterTableTab) {
    this.tabs = this.tabs.map(t => {
      t.selected = t.label === tab.label;

      return t;
    });

    this.refetch();
  }

  changeDate(date: {start: Moment, end: Moment}) {
    this.date = date;

    this.refetch();
  }

  refetch() {
    this.loadingData = true;
    this.resetEntities();
    this.service.getEntities(this.limit)
  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/transactions', option.item.id]);
        break;
      }
    }
  }

  loadMore() {
    if (!this.loadingData && this.hasMore) {
      this.loadingData = true;
      this.service.getEntities(20);
    }
  }

  openFiltersDialog() {
    let filtersDialog = this.deleteDialog.open(TransactionFiltersDialogComponent, { disableClose : true });

    filtersDialog.afterClosed().take(1).subscribe(result => {
      filtersDialog = null;

      if (result && result.filters) {
        this.refetch();
      }
    });
  }

}
