import {Component, OnInit} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {SessionsService} from '../../shared/services/sessions.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {CreditCard} from '../../shared/models/credit-card.model';
import {Acl} from '../../shared/models/acl.model';
import {environment} from '../../../environments/environment';
import {BillsService} from '../../shared/services/bills.service';
import {Bill} from '../../shared/models/bill.model';

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
  unpaidBills: Bill[] = [];

  mapAcl = (acl: Acl) => acl.account.name;

  sidenavLogo = environment.branding ? environment.branding.sidenavLogo : 'logo-white.svg';

  constructor(
    public authService: AuthenticationService,
    private sessionService: SessionsService,
    private billService: BillsService
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

      this.billService.entities$.take(1).subscribe((response) => {
        if (response instanceof CustomServerError) {
          return;
        }

        this.unpaidBills = response.filter(bill => !fill.paid);
      });

      this.billService.getEntities();
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

  signout() {
    this.authService.logout();
  }
}
