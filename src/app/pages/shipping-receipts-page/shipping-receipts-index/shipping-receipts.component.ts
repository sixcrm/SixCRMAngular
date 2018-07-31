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
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'shipping-receipt',
  templateUrl: './shipping-receipts.component.html',
  styleUrls: ['./shipping-receipts.component.scss']
})
export class ShippingReceiptsComponent extends AbstractEntityReportIndexComponent<ShippingReceipt> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'SHIPPINGRECEIPT_INDEX_TITLE'}];

  shippingReceipts: ShippingReceipt[] = [];

  constructor(
    private service: ShippingReceiptsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router
  ) {
    super(auth, dialog, router);

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

    this.date = {start: utc().subtract(1,'M'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Pending', selected: false, visible: true},
      {label: 'Shipping', selected: false, visible: true},
      {label: 'Delivered', selected: false, visible: true},
      {label: 'Errors', selected: false, visible: true}
    ];

    this.options = ['View'];
  }


  ngOnInit() {
    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(shippingReceipts => {
      if (shippingReceipts instanceof CustomServerError) {
        this.shippingReceipts = [];
        return;
      }

      this.shippingReceipts = shippingReceipts;
    });

    this.service.getEntities(20);
  }

  ngOnDestroy() {
    this.destroy();
  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/shippingreceipts', option.item.id]);
        break;
      }
    }
  }

  openFiltersDialog() {
    super.openFiltersDialog(ShippingreceiptFiltersDialogComponent);
  }

}
