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

@Component({
  selector: 'shipping-receipt',
  templateUrl: './shipping-receipts.component.html',
  styleUrls: ['./shipping-receipts.component.scss']
})
export class ShippingReceiptsComponent extends AbstractEntityIndexComponent<ShippingReceipt> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'SHIPPINGRECEIPT_INDEX_TITLE'}];

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
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_PROVIDER',(e: ShippingReceipt) => e.fulfillmentProvider.name).setSelected(false),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_CREATED', (e: ShippingReceipt) => e.createdAt.tz(tz).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('SHIPPINGRECEIPT_INDEX_HEADER_UPDATED', (e: ShippingReceipt) => e.updatedAt.tz(tz).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
