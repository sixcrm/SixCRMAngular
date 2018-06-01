import { Component, OnInit } from '@angular/core';
import {AccountsService} from '../../../shared/services/accounts.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Account} from '../../../shared/models/account.model';
import {HttpWrapperCustomerService} from '../../../shared/services/http-wrapper-customer.service';
import {Session} from '../../../shared/models/session.model';
import {MatDialog} from '@angular/material';
import {CardSwitcherDialogComponent} from '../../../dialog-modals/card-switcher-dialog/card-switcher-dialog.component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Customer} from '../../../shared/models/customer.model';
import {getPhoneNumberMask} from '../../../shared/utils/mask.utils';
import {isValidEmail} from '../../../shared/utils/form.utils';

@Component({
  selector: 'account-management-general',
  templateUrl: './account-management-general.component.html',
  styleUrls: ['./account-management-general.component.scss']
})
export class AccountManagementGeneralComponent implements OnInit {

  account: Account;
  accountBackup: Account;
  session: Session;
  defaultCreditCard: CreditCard;

  customer: Customer;
  customerBackup: Customer;

  mask = getPhoneNumberMask();
  formInvalid: boolean;


  constructor(
    private accountService: AccountsService,
    private authService: AuthenticationService,
    private customerGraphAPI: HttpWrapperCustomerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.accountService.entity$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
      this.accountBackup = this.account.copy();
    });

    this.accountService.getEntity(this.authService.getActiveAcl().account.id);

    this.fetchSession();
  }

  fetchSession() {
    const currentAcc = this.authService.getActiveAcl().account;

    if (currentAcc.billing && currentAcc.billing.session) {
      this.customerGraphAPI.fetchSessionInfo(currentAcc.billing.session).subscribe(session => {
        this.session = session;
        this.customer = this.session.customer;
        this.customerBackup = this.customer.copy();

        if (this.session.customer.defaultCreditCard) {
          const index = firstIndexOf(this.session.customer.creditCards, (el) => el.id === this.session.customer.defaultCreditCard);

          if (index !== -1) {
            this.defaultCreditCard = this.session.customer.creditCards[index];
          }
        }
      });
    }
  }

  cancelAccountUpdate() {
    this.accountBackup = this.account.copy();
  }

  updateAccount() {
    this.accountService.entityUpdated$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
      this.accountBackup = this.account.copy();
    });

    this.accountService.updateEntity(this.accountBackup);
  }

  customerEdited() {
    return this.customer.firstName !== this.customerBackup.firstName
      || this.customer.email !== this.customerBackup.email
      || this.customer.phone !== this.customerBackup.phone;
  }

  cancelCustomerUpdate() {
    this.formInvalid = false;
    this.customer = this.customerBackup.copy();
  }

  updateCustomer() {
    this.formInvalid = !this.customer.firstName || !this.validEmail() || !this.customer.phone;

    if (this.formInvalid) return;

    this.customerGraphAPI.updateCustomerInfo(this.customer).subscribe(updatedCustomer => {
      this.customer = updatedCustomer;
      this.customerBackup = updatedCustomer.copy();
    });
  }

  validEmail(): boolean {
    return isValidEmail(this.customer.email);
  }

  openCardSwitcher(): void {
    let dialogRef = this.dialog.open(CardSwitcherDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.cards = this.customer.creditCards;
    dialogRef.componentInstance.selectedDefaultCard = this.defaultCreditCard || new CreditCard();

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result && result.selectedDefaultCard && result.selectedDefaultCard.id) {
        const customer = this.session.customer.copy();
        customer.defaultCreditCard = result.selectedDefaultCard.id;

        this.customerGraphAPI.updateCustomerInfo(customer).subscribe(updatedCustomer => {
          this.customer = updatedCustomer;
          this.customerBackup = updatedCustomer.copy();

          const index = firstIndexOf(updatedCustomer.creditCards, (el) => el.id === result.selectedDefaultCard.id);

          if (index !== -1) {
            this.defaultCreditCard = updatedCustomer.creditCards[index];
          }
        });
      }
    });
  }
}
