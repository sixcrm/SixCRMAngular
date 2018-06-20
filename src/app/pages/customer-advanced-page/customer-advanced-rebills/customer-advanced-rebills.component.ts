import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Customer} from '../../../shared/models/customer.model';
import {RebillsService} from '../../../entity-services/services/rebills.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {utc} from 'moment';
import {Return} from '../../../shared/models/return.model';
import {Transaction} from '../../../shared/models/transaction.model';
import {OptionItem} from '../../components/table-memory-advanced/table-memory-advanced.component';
import {ReturnDialogComponent} from '../../../dialog-modals/return-dialog/return-dialog.component';
import {MatDialog} from '@angular/material';
import {RefundDialogComponent} from '../../../dialog-modals/refund-dialog/refund-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array.utils';

@Component({
  selector: 'customer-advanced-rebills',
  templateUrl: './customer-advanced-rebills.component.html',
  styleUrls: ['./customer-advanced-rebills.component.scss']
})
export class CustomerAdvancedRebillsComponent implements OnInit {

  _customer: Customer;

  rebills: Rebill[] = [];
  selectedRebill: Rebill;

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

  lineBreakFunction = (previous: Rebill, current: Rebill) => {
    if (previous && previous.billAt.isAfter(utc()) && current.billAt.isBefore(utc())) {
      return `Today - ${utc().format('MMMM DD, YYYY')}`;
    }

    return null;
  };

  columnParams: ColumnParams<Rebill>[] = [];
  rowColorFunction = (e: Rebill) => e.hasChargeback() ? 'rgba(220, 37, 71, 0.05)' : '#ffffff';

  options: OptionItem[] = [
    {label: 'Refund', visible: (e: Rebill) => e.canRefund()},
    {label: 'Return', visible: (e: Rebill) => e.canReturn()},
    {label: 'Notify User', visible: (e: Rebill) => true},
    {label: 'View Details', visible: (e: Rebill) => true}
  ];

  originIndex: number;

  constructor(
    private rebillService: RebillsService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_REBILL_STATE', (e: Rebill) => e.hasChargeback() ? 'Chargeback' : e.state)
        .setMaterialIconMapper((e: Rebill) => e.hasChargeback() ? 'error' : 'done')
        .setMaterialIconBackgroundColorMapper((e: Rebill) => e.hasChargeback() ? '#ffffff' : '#1EBEA5')
        .setMaterialIconColorMapper((e: Rebill) => e.hasChargeback() ? '#DC2547' : '#ffffff'),
      new ColumnParams('CUSTOMER_REBILL_BILLED',(e: Rebill) => e.billAt.tz(f).format('MM/DD/YY')),
      new ColumnParams('CUSTOMER_REBILL_AMOUNT', (e: Rebill) => e.amount.usd()),
      new ColumnParams('CUSTOMER_REBILL_ITEMS', (e: Rebill) => e.products.length + ''),
      new ColumnParams('CUSTOMER_REBILL_RETURNS', (e: Rebill) => e.getReturned().length > 0 ? e.getReturned().length + '' : '-'),
      new ColumnParams('CUSTOMER_REBILL_REFUND', (e: Rebill) => e.hasRefund() ? e.refundedAmount().usd() : '-').setAlign('center'),
      new ColumnParams('CUSTOMER_REBILL_CHARGEBACK', (e: Rebill) => e.hasChargeback() ? e.chargebackAmount().usd() : '-').setAlign('center').setSeparator(true),
      new ColumnParams('CUSTOMER_REBILL_TOTAL', (e: Rebill) => e.amountTotal().usd()).setAlign('center').setSeparator(true),
      new ColumnParams('CUSTOMER_REBILL_ORDER',(e: Rebill) => e.parentSession.alias).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_CAMPAIGN', (e: Rebill) => e.parentSession.campaign.name).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_TYPE', (e: Rebill) => '-').setAlign('center')
    ];

  }

  ngOnInit() { }

  initialize(): void {
    this.rebillService.getPastRebillsByCustomer(this._customer, {limit: 10}).subscribe(rebills => {
      this.rebills = rebills.map(r => {
        r.products = r.products.map(p => {
          // p.returns = [{quantity: 1, 'return': new Return({created_at: utc()})}];

          return p;
        });

        r.transactions = r.transactions.map(t => {
          // t.chargeback = true;
          // t.type = 'refund';

          return t;
        });

        return r;
      });

      this.loaded = true;
    });
  }

  itemClicked(option: {item: Rebill, param: ColumnParams<Rebill>}) {
    switch (option.param.label) {
      case ('CUSTOMER_REBILL_CAMPAIGN'): {
        this.router.navigate(['/campaigns', option.item.parentSession.campaign.id]);
        break
      }
      case ('CUSTOMER_REBILL_ORDER'): {
        this.router.navigate(['/sessions', option.item.parentSession.id]);
        break
      }
      default: {}
    }
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  viewSingleRebill(rebill: Rebill) {
    this.selectedRebill = rebill.copy();

    this.originIndex = this.selectedIndex;
    this.selectedGranularityIndex = 1;
    this.selectedIndex = 0;
  }

  viewAllRebills() {
    this.selectedGranularityIndex = 0;

    if (this.originIndex === 1) {
      this.selectedIndex = 1;
    }
  }

  optionSelected(event: {item: Rebill, option: OptionItem}) {
    if (event.option.label === 'View Details') {
      this.viewSingleRebill(event.item);
    }
  }

  openReturnDialog(rebill: Rebill) {
    let ref = this.dialog.open(ReturnDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.products = rebill.copy().products.filter(p => !p.returns || p.returns.length === 0);

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
  }

  openRefundDialog(rebill: Rebill) {
    let ref = this.dialog.open(RefundDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transactions = rebill.copy().transactions.filter(t => t.type !== 'refund');

    ref.afterClosed().take(1).subscribe((result) => {
      ref = null;

      if (result && result.refundedTransaction) {
        const index = firstIndexOf(this.rebills, (r: Rebill) => r.id === rebill.id);

        if (index !== -1) {
          this.rebills[index].transactions = [...this.rebills[index].transactions, result.refundedTransaction];
          this.rebills = this.rebills.slice();
        }

        if (this.selectedRebill.id === rebill.id) {
          this.selectedRebill.transactions = [...this.selectedRebill.transactions, result.refundedTransaction];
          this.selectedRebill = this.selectedRebill.copy();
        }

        this.transactionRefunded.emit(result.refundedTransaction);
      }
    })
  }
}
