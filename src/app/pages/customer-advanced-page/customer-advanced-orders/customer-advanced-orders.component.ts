import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Return} from '../../../shared/models/return.model';
import {Transaction} from '../../../shared/models/transaction.model';
import {OptionItem} from '../../components/table-memory-advanced/table-memory-advanced.component';
import {ReturnDialogComponent} from '../../../dialog-modals/return-dialog/return-dialog.component';
import {MatDialog} from '@angular/material';
import {RefundDialogComponent} from '../../../dialog-modals/refund-dialog/refund-dialog.component';
import {Order} from '../../../shared/models/order.model';

@Component({
  selector: 'customer-advanced-orders',
  templateUrl: './customer-advanced-orders.component.html',
  styleUrls: ['./customer-advanced-orders.component.scss']
})
export class CustomerAdvancedOrdersComponent implements OnInit {

  selectedIndex: number = 0;
  selectedGranularityIndex: number = 0;

  loaded: boolean;

  @Input() orders: Order[];
  @Input() selectedOrder: Order;

  @Output() transactionRefunded: EventEmitter<Transaction> = new EventEmitter();
  @Output() orderSelected: EventEmitter<Order> = new EventEmitter();

  columnParams: ColumnParams<Order>[] = [];
  rowColorFunction = (e: Order) => e.hasChargeback() ? 'rgba(220, 37, 71, 0.05)' : '#ffffff';

  options: OptionItem[] = [
    {label: 'Refund', visible: (e: Order) => e.canRefund()},
    {label: 'Return', visible: (e: Order) => e.canReturn()},
    {label: 'View Details', visible: (e: Order) => true}
  ];

  originIndex: number;

  filterString: string;
  filterMapper = (order: Order) => !this.filterString
    || `${order.rebill.alias} ${order.session.campaign.name} ${order.products.map(p => p.product.name).reduce((a,b)=>`${a} ${b}`, '')}`.toLowerCase().includes(this.filterString.toLowerCase());

  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Status', (e: Order) => e.getStatus())
        .setMaterialIconMapper((e: Order) => e.rebill.isSuccess() || e.rebill.isPartialSuccess() ? 'done' : 'error')
        .setMaterialIconBackgroundColorMapper((e: Order) => e.rebill.isSuccess() || e.rebill.isPartialSuccess() ? '#1EBEA5' : '#ffffff')
        .setMaterialIconColorMapper((e: Order) => e.rebill.isSuccess() || e.rebill.isPartialSuccess() ? '#ffffff' : '#DC2547'),
      new ColumnParams('Bill at',(e: Order) => e.rebill.billAt.tz(f).format('MM/DD/YY')),
      new ColumnParams('Amount', (e: Order) => e.amount.usd()),
      new ColumnParams('Items', (e: Order) => e.products.length + ''),
      new ColumnParams('Returns', (e: Order) => e.getReturned().length > 0 ? e.getReturned().length + '' : '-'),
      new ColumnParams('Refunds', (e: Order) => e.hasRefund() ? e.refundedAmount().usd() : '-').setAlign('center'),
      new ColumnParams('Chargebacks', (e: Order) => e.hasChargeback() ? e.chargebackAmount().usd() : '-').setAlign('center').setSeparator(true),
      new ColumnParams('Total', (e: Order) => e.amountTotal().usd()).setAlign('center').setSeparator(true),
      new ColumnParams('Order Alias',(e: Order) => e.id).setLink((e: Order) => `/customers/advanced`).setQueryParams((e: Order) => {return {order: e.rebill.id}}).setFragment((_) => `orders`),
      new ColumnParams('Session Alias',(e: Order) => e.session.alias).setLink((e: Order) => `/customers/advanced`).setQueryParams((e: Order) => {return {session: e.session.id}}).setFragment((_) => `watermark`),
      new ColumnParams('Campaign', (e: Order) => e.session.campaign.name).setLink((e: Order) => `/campaigns/${e.session.campaign.id}`),
      new ColumnParams('Type', (e: Order) => e.rebill.cycle === 0 ? 'Sale' : 'Recurring').setAlign('center')
    ];

  }

  ngOnInit() { }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  viewSingleOrder(order: Order) {
    this.orderSelected.emit(order);

    this.originIndex = this.selectedIndex;
    this.selectedGranularityIndex = 1;
    this.selectedIndex = 0;
  }

  viewAllOrders() {
    this.selectedGranularityIndex = 0;

    if (this.originIndex === 1) {
      this.selectedIndex = 1;
    }

    this.orderSelected.emit(null);
  }

  optionSelected(event: {item: Order, option: OptionItem}) {
    if (event.option.label === 'View Details') {
      this.viewSingleOrder(event.item);
    }

    if (event.option.label === 'Refund') {
      this.openRefundDialog(event.item);
    }

    if (event.option.label === 'Return') {
      this.openReturnDialog(event.item);
    }
  }

  openReturnDialog(order: Order) {
    let ref = this.dialog.open(ReturnDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.products = order.copy().products.filter(p => p.isReturnable());
    ref.componentInstance.transaction = order.copy().rebill.transactions.map(t => t.id)[0] || '';

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
  }

  openRefundDialog(order: Order) {
    let ref = this.dialog.open(RefundDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transactions = order.rebill.copy().transactions.filter(t => t.isRefundable());

    ref.afterClosed().take(1).subscribe((result) => {
      ref = null;

      if (result && result.refundedTransaction) {
        this.transactionRefunded.emit(result.refundedTransaction);
      }
    })
  }
}
