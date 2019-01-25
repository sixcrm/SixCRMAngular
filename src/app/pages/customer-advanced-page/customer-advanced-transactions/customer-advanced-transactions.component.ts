import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {OptionItem} from '../../components/table-memory-advanced/table-memory-advanced.component';
import {MatDialog} from '@angular/material';
import {RefundDialogComponent} from '../../../dialog-modals/refund-dialog/refund-dialog.component';

@Component({
  selector: 'customer-advanced-transactions',
  templateUrl: './customer-advanced-transactions.component.html',
  styleUrls: ['./customer-advanced-transactions.component.scss']
})
export class CustomerAdvancedTransactionsComponent implements OnInit {

  @Input() transactions: Transaction[] = [];

  @Output() transactionRefunded: EventEmitter<boolean> = new EventEmitter();
  @Output() orderSelected: EventEmitter<string> = new EventEmitter();

  columnParams: ColumnParams<Transaction>[] = [];
  rowColorFunction = (e: Transaction) => e.chargeback ? 'rgba(220, 37, 71, 0.05)' : '#ffffff';
  options: OptionItem[] = [
    {label: 'View Transaction', visible: (e: Transaction) => true},
    {label: 'Refund', visible: (e: Transaction) => e.isRefundable()},
    {label: 'Notify User', visible: (e: Transaction) => true}
  ];

  bulkOptions: string[] = ['Refund'];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Date', (e: Transaction) => e.createdAt.tz(f).format('MM/DD/YY h:mm A')),
      new ColumnParams('Status', (e: Transaction) => e.getStatus())
        .setMaterialIconMapper((e: Transaction) => e.chargeback || e.isError() ? 'error' : e.isDecline() || e.isSoftDecline() ? 'block' : 'done')
        .setMaterialIconBackgroundColorMapper((e: Transaction) => e.chargeback || e.isError() || e.isDecline() || e.isSoftDecline() ? '#ffffff' : '#1EBEA5')
        .setMaterialIconColorMapper((e: Transaction) => e.chargeback || e.isError() || e.isDecline() ? '#DC2547' : e.isSoftDecline() ? '#ED6922' : '#ffffff'),
      new ColumnParams('Order Alias', (e: Transaction) => e.rebill.alias || e.rebill.id).setLink((e: Transaction) => `/customers/advanced`).setQueryParams((e: Transaction) => {return {order: e.rebill.id}}).setFragment((_) => `orders`),
      new ColumnParams('Session Alias', (e: Transaction) => e.rebill.parentSession.alias).setLink((_) => `/customers/advanced`).setQueryParams((e: Transaction) => {return {session: e.rebill.parentSession.id}}).setFragment((_) => `watermark`).setSeparator(true),
      new ColumnParams('Amount', (e: Transaction) => e.isRefund() ? '-' : e.amount.usd()),
      new ColumnParams('Refund', (e: Transaction) => e.isRefund() ? e.amount.usd() : '-').setAlign('center'),
      new ColumnParams('Chargeback', (e: Transaction) => e.chargeback ? e.amount.usd() : '-').setAlign('center'),
      new ColumnParams('MID', (e: Transaction) => e.merchantProvider.name).setLink((e: Transaction) => `/merchantproviders/${e.merchantProvider.id}`),
      new ColumnParams('Transaction Alias', (e: Transaction) => e.alias).setLink((_) => `/customers/advanced`).setQueryParams((e: Transaction) => {return {transaction: e.id}}),
      new ColumnParams('Message', (e: Transaction) => e.processorResponse.message)
    ]
  }

  ngOnInit() {
  }

  multiOptionSelected(result: {items: Transaction[], option: string}) {
    switch (result.option) {
      case ('Refund'): {
        this.openRefundDialog(result.items.filter(t => t.isRefundable()).map(t => t.copy()));
        break
      }
      default: {}
    }
  }

  optionSelected(result: {item: Transaction, option: OptionItem}) {
    switch (result.option.label) {
      case ('View Transaction'): {
        this.router.navigate(['/customers', 'advanced'], { queryParams: {transaction: result.item.id}});
        break
      }
      case ('Refund'): {
        this.openRefundDialog([result.item.copy()]);
        break
      }
      default: {}
    }
  }

  openRefundDialog(transactions: Transaction[]) {
    let ref = this.dialog.open(RefundDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transactions = transactions;

    ref.afterClosed().take(1).subscribe((result) => {
      ref = null;

      if (result && result.refundedTransaction) {
        this.transactionRefunded.emit(result.refundedTransaction);
      }
    })
  }

}
