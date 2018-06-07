import {Component, OnInit, Input} from '@angular/core';
import {Customer} from '../../../../shared/models/customer.model';
import {ShippingReceipt} from '../../../../shared/models/shipping-receipt.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {ShippingReceiptsService} from '../../../../shared/services/shipping-receipts.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'customer-advanced-fulfillments',
  templateUrl: './customer-advanced-fulfillment.component.html',
  styleUrls: ['./customer-advanced-fulfillment.component.scss']
})
export class CustomerAdvancedFulfillmentComponent implements OnInit {

  _customer: Customer;

  receipts: ShippingReceipt[] = [];

  @Input() set customer(customer: Customer) {
    if (customer) {
      const performInit = !this._customer;

      this._customer = customer;

      if (performInit) {
        this.initialize();
      }
    }
  }

  columnParams: ColumnParams<ShippingReceipt>[] = [];
  options: string[];
  bulkOptions: string[];

  constructor(
    private shippingReceiptsService: ShippingReceiptsService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_FULFILLMENT_STATUS', (e: ShippingReceipt) => e.status),
      new ColumnParams('CUSTOMER_FULFILLMENT_ORDER', (e: ShippingReceipt) => '-')
        .setSeparator(true),
      new ColumnParams('CUSTOMER_FULFILLMENT_ISSUEDATE', (e: ShippingReceipt) => e.createdAt.tz(f).format('MM/DD/YY')),
      new ColumnParams('CUSTOMER_FULFILLMENT_SHIPDATE', (e: ShippingReceipt) => '-'),
      new ColumnParams('CUSTOMER_FULFILLMENT_DELIVERDATE', (e: ShippingReceipt) => '-')
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

  initialize() {
    this.shippingReceiptsService.entities$.take(1).subscribe(receipts => {
      if (receipts instanceof CustomServerError) return;

      this.receipts = receipts;
    });

    this.shippingReceiptsService.getEntities(10);
  }

  itemClicked(option: {item: ShippingReceipt, param: ColumnParams<ShippingReceipt>}) {
    switch (option.param.label) {
      case ('CUSTOMER_FULFILLMENT_PROVIDER'): {
        this.router.navigate(['/fulfillmentproviders', option.item.fulfillmentProvider.id]);
        break
      }
      default: {}
    }
  }

}
