import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {OptionItem} from '../../components/table-memory-advanced/table-memory-advanced.component';
import {ViewTransactionDialogComponent} from '../../../dialog-modals/view-transaction-dialog/view-transaction-dialog.component';
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
    {label: 'Refund', visible: (e: Transaction) => e.isSale()},
    {label: 'Notify User', visible: (e: Transaction) => true},
    {label: 'View Details', visible: (e: Transaction) => true}
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
        .setMaterialIconMapper((e: Transaction) => e.chargeback || e.isError() ? 'error' : 'done')
        .setMaterialIconBackgroundColorMapper((e: Transaction) => e.chargeback || e.isError() ? '#ffffff' : '#1EBEA5')
        .setMaterialIconColorMapper((e: Transaction) => e.chargeback || e.isError() ? '#DC2547' : '#ffffff'),
      new ColumnParams('Order', (e: Transaction) => e.rebill.alias || e.rebill.id).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('Session', (e: Transaction) => e.rebill.parentSession.alias).setClickable(true).setColor('#2C98F0').setSeparator(true),
      new ColumnParams('Amount', (e: Transaction) => e.amount.usd()),
      new ColumnParams('Refund', (e: Transaction) => e.isRefund() ? e.amount.usd() : '-').setAlign('center'),
      new ColumnParams('Chargeback', (e: Transaction) => e.chargeback ? e.amount.usd() : '-').setAlign('center'),
      new ColumnParams('MID', (e: Transaction) => e.merchantProvider.name).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('Alias', (e: Transaction) => e.alias).setSeparator(true).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('Message', (e: Transaction) => e.processorResponse.message)
    ]
  }

  ngOnInit() {
  }

  itemClicked(option: {item: Transaction, param: ColumnParams<Transaction>}) {
    switch (option.param.label) {
      case ('MID'): {
        this.router.navigate(['/merchantproviders', option.item.merchantProvider.id]);
        break
      }
      case ('Alias'): {
        this.router.navigate(['/transactions', option.item.id]);
        break
      }
      case ('Session'): {
        this.router.navigate(['/customers', 'advanced'], { queryParams: { session: option.item.rebill.parentSession.id } });
        break
      }
      case ('Order'): {
        this.orderSelected.emit(option.item.rebill.id);
        break
      }
      default: {}
    }
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
      case ('View Details'): {
        this.showTransactionDetails(result.item);
        break
      }
      case ('Refund'): {
        this.openRefundDialog([result.item.copy()]);
        break
      }
      default: {}
    }
  }

  showTransactionDetails(transaction: Transaction) {
    let ref = this.dialog.open(ViewTransactionDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transaction = transaction.copy();

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
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
