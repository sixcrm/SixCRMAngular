import { Component, OnInit } from '@angular/core';
import {AccountsService} from '../../../entity-services/services/accounts.service';
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
import {AddCreditCardDialogComponent} from '../../../dialog-modals/add-credit-card-dialog/add-credit-card-dialog.component';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AccountDetails} from '../../../shared/models/account-details.model';
import {AccountDetailsService} from '../../../entity-services/services/account-details.service';

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
  accountDetails: AccountDetails;
  accountDetailsBackup: AccountDetails;

  customer: Customer;
  customerBackup: Customer;

  mask = getPhoneNumberMask();
  formInvalid: boolean;

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Account Management'},
    {label: () => 'General'}
  ];

  idExpanded: boolean;

  constructor(
    private accountService: AccountsService,
    public authService: AuthenticationService,
    private customerGraphAPI: HttpWrapperCustomerService,
    private dialog: MatDialog,
    public accountDetailsService: AccountDetailsService
  ) { }

  ngOnInit() {
    this.accountService.entity$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
      this.accountBackup = this.account.copy();
    });

    this.accountDetailsService.entity$.take(1).subscribe(accountDetails => {
      if (accountDetails instanceof CustomServerError) return;

      this.accountDetails = accountDetails;
      this.accountDetailsBackup = this.accountDetails.copy();
    });

    this.accountService.getEntity(this.authService.getActiveAccount().id);
    this.accountDetailsService.getEntity(this.authService.getActiveAccount().id);

    this.fetchSession();
  }

  fetchSession() {
    if (!this.authService.hasPermissions('bill', 'read')) return;

    const currentAcc = this.authService.getActiveAccount();

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

    const addSub = dialogRef.componentInstance.addCard.subscribe(() => this.openCardModal());
    const editSub = dialogRef.componentInstance.editCard.subscribe((card) => this.openCardModal(card));

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (addSub) addSub.unsubscribe();
      if (editSub) editSub.unsubscribe();

      if (result && result.selectedDefaultCard && result.selectedDefaultCard.id) {
        const customer = this.customer.copy();
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

  openCardModal(creditCard?: CreditCard) {
    let dialogRef = this.dialog.open(AddCreditCardDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.creditCard = creditCard ? creditCard.copy() : new CreditCard();
    dialogRef.componentInstance.isDefaultCreditCard = creditCard ? this.customer.defaultCreditCard === creditCard.id : false;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result && result.creditCard) {
        if (creditCard) {
          this.customerGraphAPI.updateCreditCard(result.creditCard).subscribe(card => {
            const index = firstIndexOf(this.session.customer.creditCards, (el) => el.id === card.id);
            if (index !== -1) {
              card.type = this.session.customer.creditCards[index].type;
              this.session.customer.creditCards[index] = card;
              this.session.customer.creditCards = this.session.customer.creditCards.slice();
            }

            const newDefaultCardId = result.isDefaultCard ? card.id : '';

            if (newDefaultCardId !== this.session.customer.defaultCreditCard) {
              this.updateDefaultCreditCard(newDefaultCardId);
            } else {
              this.setDefaultCreditCard();
            }
          })
        } else {
          this.customerGraphAPI.createCreditCard(result.creditCard).subscribe(card => {
            this.session.customer.creditCards = [card, ...this.session.customer.creditCards];
            this.customer = this.session.customer.copy();
            this.customerBackup = this.customer.copy();

            if (result.isDefaultCard) {
              this.updateDefaultCreditCard(card.id);
            } else {
              this.setDefaultCreditCard();
            }
          })
        }
      }
    });
  }

  deleteCard(card: CreditCard): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
      if (result && result.success) {
        this.performCreditCardDelete(card);
      }
    });
  }

  performCreditCardDelete(card: CreditCard) {
    this.customerGraphAPI.deleteCreditCard(card).subscribe(deletedCard => {
      const customerIndex = firstIndexOf(this.customer.creditCards, (el: CreditCard) => el.id === deletedCard.id);
      const sessionIndex = firstIndexOf(this.session.customer.creditCards, (el: CreditCard) => el.id === deletedCard.id);

      if (customerIndex !== -1) {
        this.customer.creditCards.splice(customerIndex, 1);
        this.customerBackup = this.customer.copy();
        this.session.customer.creditCards.splice(sessionIndex, 1);
      }

      if (this.customer.defaultCreditCard === deletedCard.id) {
        this.updateDefaultCreditCard(deletedCard.id);
      }
    })
  }

  toggleExpanded() {
    this.idExpanded = this.account && !this.idExpanded
  }

  private updateDefaultCreditCard(defaultCardId: string) {
    const customer = this.customer.copy();
    customer.defaultCreditCard = defaultCardId;

    this.customerGraphAPI.updateCustomerInfo(customer).subscribe(updatedCustomer => {
      this.customer = updatedCustomer;
      this.customerBackup = updatedCustomer.copy();
      this.session.customer = updatedCustomer.copy();

      this.setDefaultCreditCard();
    });
  }

  private setDefaultCreditCard() {
    const index = firstIndexOf(this.session.customer.creditCards, (el) => el.id === this.session.customer.defaultCreditCard);

    if (index !== -1) {
      this.defaultCreditCard = this.session.customer.creditCards[index];
    }
  }

  accountDetailsEdited() {
    return (this.accountDetails.supportLink !== this.accountDetailsBackup.supportLink)
      || (this.accountDetails.emailTemplateSettings.colorPrimary !== this.accountDetailsBackup.emailTemplateSettings.colorPrimary)
      || (this.accountDetails.companyLogo !== this.accountDetailsBackup.companyLogo);
  }

  cancelAccountDetailsEdit() {
    this.accountDetails = this.accountDetailsBackup.copy();
  }

  updateAccountDetails() {
    this.accountDetailsService.entityUpdated$.take(1).subscribe(accountDetails => {
      if (accountDetails instanceof CustomServerError) return;

      this.accountDetails = accountDetails;
      this.accountDetailsBackup = this.accountDetails.copy();
    });

    this.accountDetailsService.updateEntity(this.accountDetails);
  }
}
