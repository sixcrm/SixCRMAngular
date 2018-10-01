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
    private customerGraphAPI: HttpWrapperCustomerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.account = this.authService.getActiveAccount();

    this.fetchSession();
  }

  fetchSession() {
    const currentAcc = this.authService.getActiveAccount();

    if (currentAcc.billing && currentAcc.billing.session) {
      this.customerGraphAPI.fetchSessionInfo(currentAcc.billing.session).subscribe(session => {
        session.rebills = session.rebills
          .sort((f,s) => {
            if (f.billAt.isAfter(s.billAt)) return -1;
            if (f.billAt.isBefore(s.billAt)) return 1;

            return 0;
          });

        this.nextBill = session.rebills[0];
        this.lastBill = session.rebills[1];

        session.rebills = session.rebills.filter(r => r.billAt.isSameOrBefore(utc()));

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
    if (!rebill) return true;

    return rebill.transactions
      && rebill.transactions.length > 0
      && rebill.transactions.some(t => t.type === 'sale' && t.processorResponse.code === 'success')
  }

  getCardNumber(rebill): string {
    if (!rebill.transactions || !rebill.transactions[0]) return '-';

    return rebill.transactions[0].creditCard.lastFour;
  }

  getPlanPrice(rebill) {
    if (!rebill) return new Currency(0);

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

    const editSub = dialogRef.componentInstance.editCard.subscribe((card) => this.openCardModal(card, dialogRef));

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (editSub) editSub.unsubscribe();

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

  openCardModal(creditCard: CreditCard, switcherRef) {
    let dialogRef = this.dialog.open(AddCreditCardDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.creditCard = creditCard.copy();
    dialogRef.componentInstance.hideDefaultCardSelection = true;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result && result.creditCard) {
        this.customerGraphAPI.updateCreditCard(result.creditCard).subscribe(card => {
          const index = firstIndexOf(this.session.customer.creditCards, (el) => el.id === card.id);
          if (index !== -1) {
            card.type = this.session.customer.creditCards[index].type;
            this.session.customer.creditCards[index] = card;
            this.session.customer.creditCards = this.session.customer.creditCards.slice();

            switcherRef.componentInstance.cards = this.session.customer.creditCards.sort((a,b) => a.createdAt.isBefore(b.createdAt) ? 1 : a.createdAt.isAfter(b.createdAt) ? -1 : 0);
          }
        })
      }
    });
  }
}
