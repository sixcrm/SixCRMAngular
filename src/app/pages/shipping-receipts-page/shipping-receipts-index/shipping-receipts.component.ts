import {Component, OnInit, OnDestroy} from '@angular/core';
import {ShippingReceiptsService} from "../../../entity-services/services/shipping-receipts.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {Moment, utc} from 'moment';
import {FilterTableTab} from '../../../shared/components/filter-table/filter-table.component';
import {ShippingreceiptFiltersDialogComponent} from '../../../dialog-modals/shippingreceipt-filters-dialog/shippingreceipt-filters-dialog.component';

@Component({
  selector: 'shipping-receipt',
  templateUrl: './shipping-receipts.component.html',
  styleUrls: ['./shipping-receipts.component.scss']
})
export class ShippingReceiptsComponent extends AbstractEntityIndexComponent<ShippingReceipt> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'SHIPPINGRECEIPT_INDEX_TITLE'}];

  date: {start: Moment, end: Moment} = {start: utc().subtract(1,'M'), end: utc()};

  tabs: FilterTableTab[] = [
    {label: 'All', selected: true, visible: true},
    {label: 'Pending', selected: false, visible: true},
    {label: 'Shipping', selected: false, visible: true},
    {label: 'Delivered', selected: false, visible: true},
    {label: 'Errors', selected: false, visible: true}
  ];

  options = ['View'];

  constructor(
    shippingReceiptsService: ShippingReceiptsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(shippingReceiptsService, auth, dialog, paginationService, router, activatedRoute);

    const tz = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_ID',(e: ShippingReceipt) => e.id).setSelected(false),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_STATUS', (e: ShippingReceipt) => e.parseStatus()).setTranslateOption(true),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_NUMBER',(e: ShippingReceipt) => e.tracking.id),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_CARRIER',(e: ShippingReceipt) => e.tracking.carrier),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_PROVIDER',(e: ShippingReceipt) => e.fulfillmentProvider.name),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_CREATED', (e: ShippingReceipt) => e.createdAt.tz(tz).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_UPDATED', (e: ShippingReceipt) => e.updatedAt.tz(tz).format('MM/DD/YYYY')).setSelected(false)
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
        this.router.navigate(['/shippingreceipts', option.item.id]);
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
    let filtersDialog = this.deleteDialog.open(ShippingreceiptFiltersDialogComponent, { disableClose : true });

    filtersDialog.afterClosed().take(1).subscribe(result => {
      filtersDialog = null;

      if (result && result.filters) {
        this.refetch();
      }
    });
  }

}
