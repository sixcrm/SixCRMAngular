import {Component, OnInit} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Acl} from '../../shared/models/acl.model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  planInProgress: boolean = true;
  paymentInProgress: boolean;

  plan: Plan;
  mapAcl = (acl: Acl) => acl.account.name;

  sidenavLogo = environment.branding ? environment.branding.sidenavLogo : 'logo-white.svg';

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
  }

  setPlanInProgress() {
    this.planInProgress = true;
    this.paymentInProgress = false;
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

  signout() {
    this.authService.logout();
  }
}
