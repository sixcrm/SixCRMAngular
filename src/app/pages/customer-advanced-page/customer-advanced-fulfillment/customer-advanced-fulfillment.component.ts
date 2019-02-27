import {Component, OnInit, Input} from '@angular/core';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'customer-advanced-fulfillments',
  templateUrl: './customer-advanced-fulfillment.component.html',
  styleUrls: ['./customer-advanced-fulfillment.component.scss']
})
export class CustomerAdvancedFulfillmentComponent implements OnInit {

  @Input() receipts: ShippingReceipt[] = [];

  columnParams: ColumnParams<ShippingReceipt>[] = [];
  options: string[];
  bulkOptions: string[];

  constructor(private authService: AuthenticationService) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_FULFILLMENT_ISSUEDATE', (e: ShippingReceipt) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('CUSTOMER_FULFILLMENT_ORDER', (e: ShippingReceipt) => e.rebill.alias)
        .setLink((e: ShippingReceipt) => `/customers/advanced`)
        .setQueryParams((e: ShippingReceipt) => {return {order: e.rebill.id}})
        .setFragment((_) => `orders`)
        .setSeparator(true),
      new ColumnParams('CUSTOMER_FULFILLMENT_PROVIDER', (e: ShippingReceipt) => e.fulfillmentProvider.name)
        .setLink((e: ShippingReceipt) => `/fulfillmentproviders/${e.fulfillmentProvider.id}`),
      new ColumnParams('CUSTOMER_FULFILLMENT_NUMBER', (e: ShippingReceipt) => e.tracking.id),
      new ColumnParams('CUSTOMER_FULFILLMENT_CARRIER', (e: ShippingReceipt) => e.tracking.carrier)
    ];
  }

  ngOnInit() {
  }

}
