import {Component, OnInit} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Acl} from '../../shared/models/acl.model';
import {environment} from '../../../environments/environment';
import {CreditCard} from '../../shared/models/credit-card.model';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  planInProgress: boolean = true;
  paymentInProgress: boolean;
  confirmationInProgress: boolean;

  plan: Plan;
  mapAcl = (acl: Acl) => acl.account.name;

  sidenavLogo = environment.branding ? environment.branding.sidenavLogo : 'logo-white.svg';

  creditCard: CreditCard = new CreditCard();

  constructor(
    public authService: AuthenticationService
  ) { }

  ngOnInit() { }

  setSelectedPlan(plan: Plan) {
    this.plan = plan;
    this.setPaymentInProgress();
  }

  setPaymentInProgress() {
    this.planInProgress = false;
    this.paymentInProgress = true;
    this.confirmationInProgress = false;
  }

  setPlanInProgress() {
    this.planInProgress = true;
    this.paymentInProgress = false;
    this.confirmationInProgress = false;
  }

  setCreditCard(creditCard: CreditCard) {
    this.creditCard = creditCard.copy();

    this.planInProgress = false;
    this.paymentInProgress = false;
    this.confirmationInProgress = true;
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

  signout() {
    this.authService.logout();
  }
}
