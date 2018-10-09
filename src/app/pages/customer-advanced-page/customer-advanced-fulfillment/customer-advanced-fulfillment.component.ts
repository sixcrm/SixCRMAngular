import {Component, OnInit, Input} from '@angular/core';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';

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

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_FULFILLMENT_ISSUEDATE', (e: ShippingReceipt) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('CUSTOMER_FULFILLMENT_ORDER', (e: ShippingReceipt) => e.rebill.alias)
        .setClickable(true)
        .setColor('#2C98F0')
        .setSeparator(true),
      new ColumnParams('CUSTOMER_FULFILLMENT_PROVIDER', (e: ShippingReceipt) => e.fulfillmentProvider.name)
        .setClickable(true)
        .setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_FULFILLMENT_NUMBER', (e: ShippingReceipt) => e.tracking.id),
      new ColumnParams('CUSTOMER_FULFILLMENT_CARRIER', (e: ShippingReceipt) => e.tracking.carrier)
    ];
  }

  ngOnInit() {
  }

  itemClicked(option: {item: ShippingReceipt, param: ColumnParams<ShippingReceipt>}) {
    switch (option.param.label) {
      case ('CUSTOMER_FULFILLMENT_PROVIDER'): {
        this.router.navigate(['/fulfillmentproviders', option.item.fulfillmentProvider.id]);
        break
      }
      case ('CUSTOMER_FULFILLMENT_ORDER'): {
        this.router.navigate(['/customers', 'advanced'], {queryParams: {order: option.item.rebill.id}});
        break
      }
      default: {}
    }
  }

}
