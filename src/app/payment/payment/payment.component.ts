import {Component, OnInit} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {SessionsService} from '../../shared/services/sessions.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {CreditCard} from '../../shared/models/credit-card.model';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  planInProgress: boolean = true;
  paymentInProgress: boolean;

  plan: Plan;
  isRecurringPayment: boolean = false;
  creditCards: CreditCard[] = [];

  mapAcl = (acl: Acl) => acl.account.name;

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionsService
    public authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.isRecurringPayment = this.authService.isBillingDisabled();

    let sessionId = this.authService.getActiveAcl().account.billing.session;

    if (sessionId) {
      this.sessionService.entity$.take(1).subscribe((response) => {
        if (response instanceof CustomServerError) {
          return;
        }

        this.creditCards = response.customer.creditCards;

      });

      this.sessionService.getEntity(sessionId);
    }

    if (this.isRecurringPayment) {
      this.setSelectedPlan(Plan.ofServerName(this.authService.getActiveAcl().account.billing.plan));
    }
  }

  setSelectedPlan(plan: Plan) {
    this.plan = plan;
    this.setPaymentInProgress();
  }

  setPaymentInProgress() {
    this.planInProgress = false;
    this.paymentInProgress = true;
  }

  changePlanEmitted() {
    this.planInProgress = true;
    this.paymentInProgress = false;
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

  accountPaymentFinished() {
    this.authService.getUserIntrospection({}, '/dashboard?w=true');
  }
}
