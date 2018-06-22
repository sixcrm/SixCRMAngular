import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Customer} from '../../../shared/models/customer.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {Return} from '../../../shared/models/return.model';
import {Transaction} from '../../../shared/models/transaction.model';
import {OptionItem} from '../../components/table-memory-advanced/table-memory-advanced.component';
import {ReturnDialogComponent} from '../../../dialog-modals/return-dialog/return-dialog.component';
import {MatDialog} from '@angular/material';
import {RefundDialogComponent} from '../../../dialog-modals/refund-dialog/refund-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {OrdersService} from '../../../entity-services/services/orders.service';
import {Order} from '../../../shared/models/order.model';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';

@Component({
  selector: 'customer-advanced-orders',
  templateUrl: './customer-advanced-orders.component.html',
  styleUrls: ['./customer-advanced-orders.component.scss']
})
export class CustomerAdvancedOrdersComponent implements OnInit {

  _customer: Customer;

  orders: Order[] = [];
  selectedOrder: Order;

  selectedIndex: number = 0;
  selectedGranularityIndex: number = 0;

  loaded: boolean;

  @Input() set customer(customer: Customer) {
    if (customer) {
      const performInit = !this._customer;

      this._customer = customer;

      if (performInit) {
        this.initialize();
      }
    }
  }

  @Output() transactionRefunded: EventEmitter<Transaction> = new EventEmitter();

  columnParams: ColumnParams<Order>[] = [];
  rowColorFunction = (e: Order) => e.hasChargeback() ? 'rgba(220, 37, 71, 0.05)' : '#ffffff';

  options: OptionItem[] = [
    {label: 'Refund', visible: (e: Order) => e.canRefund()},
    {label: 'Return', visible: (e: Order) => e.canReturn()},
    {label: 'Notify User', visible: (e: Order) => true},
    {label: 'View Details', visible: (e: Order) => true}
  ];

  originIndex: number;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_REBILL_STATE', (e: Order) => e.hasChargeback() ? 'Chargeback' : e.rebill.state)
        .setMaterialIconMapper((e: Order) => e.hasChargeback() ? 'error' : 'done')
        .setMaterialIconBackgroundColorMapper((e: Order) => e.hasChargeback() ? '#ffffff' : '#1EBEA5')
        .setMaterialIconColorMapper((e: Order) => e.hasChargeback() ? '#DC2547' : '#ffffff'),
      new ColumnParams('CUSTOMER_REBILL_BILLED',(e: Order) => e.date.tz(f).format('MM/DD/YY')),
      new ColumnParams('CUSTOMER_REBILL_AMOUNT', (e: Order) => e.amount.usd()),
      new ColumnParams('CUSTOMER_REBILL_ITEMS', (e: Order) => e.products.length + ''),
      new ColumnParams('CUSTOMER_REBILL_RETURNS', (e: Order) => e.getReturned().length > 0 ? e.getReturned().length + '' : '-'),
      new ColumnParams('CUSTOMER_REBILL_REFUND', (e: Order) => e.hasRefund() ? e.refundedAmount().usd() : '-').setAlign('center'),
      new ColumnParams('CUSTOMER_REBILL_CHARGEBACK', (e: Order) => e.hasChargeback() ? e.chargebackAmount().usd() : '-').setAlign('center').setSeparator(true),
      new ColumnParams('CUSTOMER_REBILL_TOTAL', (e: Order) => e.amountTotal().usd()).setAlign('center').setSeparator(true),
      new ColumnParams('CUSTOMER_REBILL_ORDER',(e: Order) => e.session.alias).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_CAMPAIGN', (e: Order) => e.session.campaign.name).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_TYPE', (e: Order) => '-').setAlign('center')
    ];

  }

  ngOnInit() { }

  initialize(): void {
    this.ordersService.getOrdersByCustomer(this._customer, {}).subscribe(orders => {

      this.orders = orders.map(o => {
        o.products = o.products.map(p => {
          // p.returns = [{quantity: 1, 'return': new Return({created_at: utc()})}];

          return p;
        });

        const shipReceipt1 = new ShippingReceipt({id:"d6c96609-1d51-4263-967e-96a5671c1304",status:"pending",tracking:null,fulfillment_provider:{id:"1bd805d0-0062-499b-ae28-00c5d1b827ba",name:"Hashtag Fulfillment Provider"},history:[{"created_at":"2018-05-11T18:37:04.281Z",status:"pending",detail:"Fulfillment Provider notified."}],created_at:"2018-05-11T18:37:04.287Z",updated_at:"2018-05-11T18:37:04.287Z"});
        const shipReceipt2 = new ShippingReceipt({id:"d6c96609-1d51-4263-967e-96a5671c1222",status:"delivered",tracking:null,fulfillment_provider:{id:"1bd805d0-0062-499b-ae28-00c5d1b827ba",name:"Hashtag Fulfillment Provider"},history:[{"created_at":"2018-05-11T18:37:04.281Z",status:"pending",detail:"Fulfillment Provider notified."}],created_at:"2018-05-11T18:37:04.287Z",updated_at:"2018-05-11T18:37:04.287Z"});

        if (o.products[1]) {
          o.products[1].shippingReceipt = shipReceipt1.copy();
        }

        if (o.products[2]) {
          o.products[2].shippingReceipt = shipReceipt2.copy();
        }

        o.rebill.transactions = o.rebill.transactions.map(t => {
          // t.chargeback = true;
          // t.type = 'refund';

          return t;
        });

        return o;
      });

      this.loaded = true;
    });
  }

  itemClicked(option: {item: Order, param: ColumnParams<Order>}) {
    switch (option.param.label) {
      case ('CUSTOMER_REBILL_CAMPAIGN'): {
        this.router.navigate(['/campaigns', option.item.session.campaign.id]);
        break
      }
      case ('CUSTOMER_REBILL_ORDER'): {
        this.router.navigate(['/sessions', option.item.session.id]);
        break
      }
      default: {}
    }
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  viewSingleOrder(order: Order) {
    this.selectedOrder = order.copy();

    this.originIndex = this.selectedIndex;
    this.selectedGranularityIndex = 1;
    this.selectedIndex = 0;
  }

  viewAllOrders() {
    this.selectedGranularityIndex = 0;

    if (this.originIndex === 1) {
      this.selectedIndex = 1;
    }
  }

  optionSelected(event: {item: Order, option: OptionItem}) {
    if (event.option.label === 'View Details') {
      this.viewSingleOrder(event.item);
    }
  }

  openReturnDialog(order: Order) {
    let ref = this.dialog.open(ReturnDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.products = order.copy().products.filter(p => !p.returns || p.returns.length === 0);

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
  }

  openRefundDialog(order: Order) {
    let ref = this.dialog.open(RefundDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transactions = order.rebill.copy().transactions.filter(t => t.type !== 'refund');

    ref.afterClosed().take(1).subscribe((result) => {
      ref = null;

      if (result && result.refundedTransaction) {
        const index = firstIndexOf(this.orders, (o: Order) => o.id === order.id);

        if (index !== -1) {
          this.orders[index].rebill.transactions = [...this.orders[index].rebill.transactions, result.refundedTransaction];
          this.orders = this.orders.slice();
        }

        if (this.selectedOrder.id === order.id) {
          this.selectedOrder.rebill.transactions = [...this.selectedOrder.rebill.transactions, result.refundedTransaction];
          this.selectedOrder = this.selectedOrder.copy();
        }

        this.transactionRefunded.emit(result.refundedTransaction);
      }
    })
  }
}
