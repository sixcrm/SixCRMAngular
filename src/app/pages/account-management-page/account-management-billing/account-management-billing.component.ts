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
import {Router} from '@angular/router';

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

  constructor(
    private authService: AuthenticationService,
    private customerGraphAPI: HttpWrapperCustomerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.account = this.authService.getActiveAcl().account;

    this.fetchSession();
  }

  fetchSession() {
    const currentAcc = this.authService.getActiveAcl().account;

    if (currentAcc.billing && currentAcc.billing.session) {
      this.customerGraphAPI.fetchSessionInfo(currentAcc.billing.session).subscribe(session => {
        this.session = session;

        if (this.session.customer.defaultCreditCard) {
          const index = firstIndexOf(this.session.customer.creditCards, (el) => el.id === this.session.customer.defaultCreditCard);

          if (index !== -1) {
            this.defaultCreditCard = this.session.customer.creditCards[index];
          }
        }

        this.lastBill = this.session.rebills
          .filter(rebill => rebill.billAt.isBefore(utc()))
          .sort((f,s) => {
            if (f.billAt.isAfter(s.billAt)) return 1;
            if (f.billAt.isBefore(s.billAt)) return -1;

            return 0;
          })[0];
      });
    }
  }

  isStatusSuccess(rebill): boolean {
    if (!rebill.transactions || !rebill.transactions[0]) return false;

    return rebill.transactions[0].processorResponse.code === 'success';
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

  navigateToGeneral() {
    this.router.navigate(['/accountmanagement', 'general']);
  }
}
