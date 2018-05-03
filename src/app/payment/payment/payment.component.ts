import {Component, OnInit} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  planInProgress: boolean = true;
  paymentInProgress: boolean;
  showWelcome: boolean;

  plan: Plan;

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
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

  accountRegistrationFinished() {
    this.planInProgress = false;
    this.paymentInProgress = false;
    this.showWelcome = true;

    setTimeout(() => {
      this.authService.getUserIntrospection({}, '/dashboard');
    }, 1000)
  }
}
