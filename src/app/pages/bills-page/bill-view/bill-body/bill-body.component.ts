import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Account} from '../../../../shared/models/account.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Currency} from '../../../../shared/utils/currency/currency';
import {BillDetails} from '../../../../shared/models/bill-details.model';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {MdDialog} from '@angular/material';
import {AddBillDetailsDialogComponent} from '../../../../dialog-modals/add-bill-details-dialog.component';
import {utc} from 'moment';
import {parseCurrencyMaskedValue} from '../../../../shared/utils/mask.utils';
import {Bill} from '../../../../shared/models/bill.model';
import {AccountsService} from '../../../../shared/services/accounts.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'bill-body',
  templateUrl: './bill-body.component.html',
  styleUrls: ['./bill-body.component.scss']
})
export class BillBodyComponent implements OnInit {

  @Input() bill: Bill;
  @Input() embedded: boolean;
  @Input() addMode: boolean;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<Bill> = new EventEmitter();

  accounts: Account[] = [];

  editMode: boolean;
  selectedAccount: Account = new Account();
  accountMapper = (account: Account) => account.name;
  formInvalid: boolean;

  constructor(public authService: AuthenticationService, private dialog: MdDialog, private accountService: AccountsService) { }

  ngOnInit() {
    this.accountService.entities$.take(1).subscribe(accounts => {
      if (accounts instanceof CustomServerError) {
        this.accounts = [];

        return;
      }

      this.accounts = accounts;
    });

    this.accountService.getEntities();
  }

  calculateAmount(): string {
    if (!this.bill) {
      return new Currency(0).usd();
    }

    return new Currency(this.bill.detail.map(d => d.amount.amount).reduce((a,b)=>+a + +b,0)).usd();
  }

  cancelEdit(): void {
    this.cancel.emit(true);
    this.editMode = false;
  }

  saveBill(): void {
    this.editMode = false;

    if (this.authService.isActiveAclMasterAccount()) {
      this.formInvalid = !this.selectedAccount.id;
      if (this.formInvalid) return;

      this.bill.account = this.selectedAccount.id;
    }

    this.save.emit(this.bill);
  }

  removeItem(detail: BillDetails[]): void {
    const index = firstIndexOf(this.bill.detail, (el) => JSON.stringify(detail) === JSON.stringify(el));

    if (index !== -1) {
      this.bill.detail.splice(index,1);
    }
  }

  showAddDetailsModal(details?: BillDetails) {
    let ref = this.dialog.open(AddBillDetailsDialogComponent);

    ref.componentInstance.description = details ? details.description : '';
    ref.componentInstance.amount = details ? details.amount.amount + '' : '0';

    ref.afterClosed().take(1).subscribe(result => {
      ref = null;
      if (result && result.description && result.amount) {
        if (details) {
          details.description = result.description;
          details.amount = new Currency(parseCurrencyMaskedValue(result.amount));
        } else {
          const newItem = new BillDetails({description: result.description, amount: parseCurrencyMaskedValue(result.amount), created_at: utc().format()});

          this.bill.detail.push(newItem);
        }
      }
    });
  }
}
