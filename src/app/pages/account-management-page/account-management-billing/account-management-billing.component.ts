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

@Component({
  selector: 'account-management-billing',
  templateUrl: './account-management-billing.component.html',
  styleUrls: ['./account-management-billing.component.scss']
})
export class AccountManagementBillingComponent implements OnInit {

  account: Account;
  session: Session;

  lastBill: Rebill;

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
          .filter(rebill => rebill.billAt.isBefore(utc()))
          .sort((f,s) => {
            if (f.billAt.isAfter(s.billAt)) return 1;
            if (f.billAt.isBefore(s.billAt)) return -1;

            return 0;
          }).filter(rebill => rebill.billAt.isSameOrBefore(utc()));

        this.session = session;

        if (this.session.customer.defaultCreditCard) {
          const index = firstIndexOf(this.session.customer.creditCards, (el) => el.id === this.session.customer.defaultCreditCard);

          if (index !== -1) {
            this.defaultCreditCard = this.session.customer.creditCards[index];
          }
        }

        this.lastBill = this.session.rebills[0];
      });
    }
  }

  isStatusSuccess(rebill): boolean {
    if (!rebill.transactions || !rebill.transactions[0]) return false;

    return rebill.transactions[0].processorResponse.code === 'success';
  }

  getStatus(rebill): string {
    if (!rebill.transactions || !rebill.transactions[0]) return 'pending';

    return rebill.transactions[0].processorResponse.code;
  }

  getCard(rebill): {brand?: string, last4?: string} {
    if (!rebill.transactions || !rebill.transactions[0]) return {};

    return rebill.transactions[0].processorResponse.getCard();
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

    dialogRef.componentInstance.cards = this.session.customer.creditCards;
    dialogRef.componentInstance.selectedDefaultCard = this.defaultCreditCard || new CreditCard();

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

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
}
