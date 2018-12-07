import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Account} from '../../../shared/models/account.model';
import {HttpWrapperCustomerService} from '../../../shared/services/http-wrapper-customer.service';
import {Session} from '../../../shared/models/session.model';
import {Rebill} from '../../../shared/models/rebill.model';
import {utc} from 'moment';
import {Currency} from '../../../shared/utils/currency/currency';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {CardSwitcherDialogComponent} from '../../../dialog-modals/card-switcher-dialog/card-switcher-dialog.component';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AddCreditCardDialogComponent} from '../../../dialog-modals/add-credit-card-dialog/add-credit-card-dialog.component';
import {PaymentDialogComponent} from '../../../dialog-modals/payment-dialog/payment-dialog.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {UsersService} from '../../../entity-services/services/users.service';
import {HttpWrapperBillingService} from '../../../shared/services/http-wrapper-billing.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {SnackbarService} from '../../../shared/services/snackbar.service';

@Component({
  selector: 'account-management-billing',
  templateUrl: './account-management-billing.component.html',
  styleUrls: ['./account-management-billing.component.scss']
})
export class AccountManagementBillingComponent implements OnInit {

  account: Account;
  session: Session;

  lastBill: Rebill;
  nextBill: Rebill;

  defaultCreditCard: CreditCard;

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Account Management'},
    {label: () => 'Billing'}
  ];

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private customerGraphAPI: HttpWrapperCustomerService,
    private dialog: MatDialog,
    private billingService: HttpWrapperBillingService,
    private navigationService: NavigationService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.account = this.authService.getActiveAccount();

    this.fetchSession();
  }

  fetchSession() {
    const currentAcc = this.authService.getActiveAccount();

    if (currentAcc.billing && currentAcc.billing.session) {
      this.customerGraphAPI.fetchSessionInfo(currentAcc.billing.session).subscribe(session => {
        session.rebills = session.rebills.sort((a,b) => a.billAt.isBefore(b.billAt) ? 1 : a.billAt.isAfter(b.billAt) ? -1 : 0);

        const futureRebills = session.rebills.filter(r => r.billAt.isAfter(utc()));
        const pastRebills = session.rebills.filter(r => r.billAt.isSameOrBefore(utc()));

        this.lastBill = pastRebills[0] || new Rebill();
        this.nextBill = futureRebills[0] || new Rebill({bill_at: this.lastBill.billAt.add(1,'M')});

        session.rebills = pastRebills;

        this.session = session;

        if (this.session.customer.defaultCreditCard) {
          const index = firstIndexOf(this.session.customer.creditCards, (el) => el.id === this.session.customer.defaultCreditCard);

          if (index !== -1) {
            this.defaultCreditCard = this.session.customer.creditCards[index];
          }
        }
      });
    }
  }

  isPaid(rebill: Rebill): boolean {
    if (!rebill) return false;

    return rebill.transactions
      && rebill.transactions.length > 0
      && rebill.transactions.some(t => t.type === 'sale' && t.processorResponse.code === 'success')
  }

  getCardNumber(rebill): string {
    if (!rebill.transactions || !rebill.transactions[0] || rebill.transactions[0].creditCard) return '-';

    return `**** ${rebill.transactions[0].creditCard.lastFour}`;
  }

  getPlanName(rebill): string {
    if (!rebill || !rebill.productSchedules || !rebill.productSchedules[0]) return '';

    return rebill.productSchedules[0].name;
  }

  getPlanPrice(rebill) {
    if (!rebill || !rebill.productSchedules || !rebill.productSchedules[0]) return new Currency(0);

    const plan = rebill.productSchedules[0].name;

    if (plan === 'Basic Subscription') {
      return new Currency(30);
    }

    if (plan === 'Professional Subscription') {
      return new Currency(150);
    }

    if (plan === 'Premium Subscription') {
      return new Currency(2000);
    }

    return new Currency(0);
  }

  openCardSwitcher(): void {
    let dialogRef = this.dialog.open(CardSwitcherDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.cards = this.session.customer.creditCards.sort((a,b) => a.createdAt.isBefore(b.createdAt) ? 1 : a.createdAt.isAfter(b.createdAt) ? -1 : 0);
    dialogRef.componentInstance.selectedDefaultCard = this.defaultCreditCard || new CreditCard();
    dialogRef.componentInstance.updateEmbedded = true;
    dialogRef.componentInstance.addEmbedded = true;

    const editSub = dialogRef.componentInstance.editCard.subscribe((card) => this.openCardModal(dialogRef, card));
    const addSub = dialogRef.componentInstance.addCard.subscribe((card) => this.openCardModal(dialogRef));

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (editSub) editSub.unsubscribe();
      if (addSub) editSub.unsubscribe();

      if (result && result.selectedDefaultCard && result.selectedDefaultCard.id) {
        const customer = this.session.customer.copy();
        customer.defaultCreditCard = result.selectedDefaultCard.id;

        this.customerGraphAPI.updateCustomerInfo(customer).subscribe(updatedCustomer => {
          this.session.customer = updatedCustomer;

          const index = firstIndexOf(updatedCustomer.creditCards, (el) => el.id === result.selectedDefaultCard.id);

          if (index !== -1) {
            this.defaultCreditCard = updatedCustomer.creditCards[index];
          }
        });
      }
    });
  }

  openCardModal(switcherRef, creditCard?: CreditCard) {
    let dialogRef = this.dialog.open(AddCreditCardDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.creditCard = creditCard ? creditCard.copy() : new CreditCard({});
    dialogRef.componentInstance.hideDefaultCardSelection = !!creditCard;
    dialogRef.componentInstance.isDefaultCreditCard = !creditCard;

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

              switcherRef.componentInstance.cards = this.session.customer.creditCards.sort((a,b) => a.createdAt.isBefore(b.createdAt) ? 1 : a.createdAt.isAfter(b.createdAt) ? -1 : 0);
            }
          })
        } else {
          if (result.isDefaultCard) {
            switcherRef.close({});
          }

          this.customerGraphAPI.createCreditCard(result.creditCard).subscribe(card => {
            this.session.customer.creditCards = [...this.session.customer.creditCards, card];

            if (result.isDefaultCard) {
              this.defaultCreditCard = card.copy();
              this.session.customer.defaultCreditCard = this.defaultCreditCard.id;
            } else {
              switcherRef.componentInstance.cards = [...switcherRef.componentInstance.cards, card];
            }

            this.customerGraphAPI.updateCustomerInfo(this.session.customer.copy()).subscribe(customer => {
              this.session.customer = customer;
            })
          })
        }

      }
    });
  }

  payRebill(rebill: Rebill) {
    let paymentDialogRef = this.dialog.open(PaymentDialogComponent, {backdropClass: 'backdrop-blue'});

    paymentDialogRef.componentInstance.creditCard = new CreditCard({});
    paymentDialogRef.componentInstance.otherCreditCards = this.session.customer.creditCards.slice();
    paymentDialogRef.componentInstance.rebill = rebill;

    this.userService.getlatestTermsAndConditions(this.authService.getActiveAcl().account.id, 'owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      paymentDialogRef.componentInstance.terms = response.body.response.data.latesttermsandconditions;
    });

    paymentDialogRef.afterClosed().subscribe(result => {
      paymentDialogRef = null;

      if (result && result.card) {

        this.navigationService.setShowProcessingOrderOverlay(true);
        if (result.card.id) {
          const customer = this.session.customer.copy();
          customer.defaultCreditCard = result.card.id;

          this.customerGraphAPI.updateCustomerInfo(customer).subscribe(updatedCustomer => {
            this.session.customer = updatedCustomer;
            const index = firstIndexOf(updatedCustomer.creditCards, (el) => el.id === result.card.id);
            if (index !== -1) {
              this.defaultCreditCard = updatedCustomer.creditCards[index];
            }

            this.rebillReattempt(rebill);
          }, () => {
            this.navigationService.setShowProcessingOrderOverlay(false);
          });
        } else {
          this.rebillReattempt(rebill, result.card);
        }
      }
    });
  }

  rebillReattempt(rebill: Rebill, card?: CreditCard) {
    this.billingService.rebillReattempt(rebill, card).subscribe(resp => {
      this.navigationService.setShowProcessingOrderOverlay(false);

      if (resp.result === 'success') {
        this.snackbarService.showSuccessSnack('Payment Successful!', 3000);
      } else {
        this.snackbarService.showErrorSnack('Payment failed, please try again.', 5000);
      }

      this.fetchSession();
    }, error => {
      this.navigationService.setShowProcessingOrderOverlay(false);
      this.snackbarService.showErrorSnack(error.error.message, 5000);
      this.fetchSession();
    })
  }
}
