import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {Acl} from '../../shared/models/acl.model';
import {User} from '../../shared/models/user.model';
import {Account} from '../../shared/models/account.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {AclsService} from '../../shared/services/acls.service';
import {UsersService} from '../../shared/services/users.service';
import {TermsDialogComponent} from '../../dialog-modals/terms-dialog/terms-dialog.component';
import {MatDialog} from '@angular/material';
import {Plan} from './plan.model';

interface Terms {
  version?: string,
  title?: string,
  body?: string
}

@Component({
  selector: 'c-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  acl: Acl;
  user: User;

  firstName: string;
  lastName: string;
  companyName: string;

  formInvalid: boolean;

  userTerms: Terms = {version: '0.1', title: 'USER TERMS AND CONDITIONS', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'};
  ownerTerms: Terms = {version: '0.1', title: 'OWNER TERMS AND CONDITIONS', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'};

  activatingAccount: boolean;
  activatingUser: boolean;

  requestInProgress: boolean;

  accountInProgress: boolean;
  planInProgress: boolean;
  paymentInProgress: boolean;
  showWelcome: boolean;

  inited: boolean;
  showProgress: boolean;
  plan: Plan;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private aclService: AclsService,
    private userService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const payload = this.authService.getPayload();

    this.firstName = payload.given_name;
    this.lastName = payload.family_name;

    this.userService.getLatestTermsAndConditions().take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.userTerms = response.body.response.data.latesttermsandconditions;
    });

    this.userService.getLatestTermsAndConditions('owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.ownerTerms = response.body.response.data.latesttermsandconditions;
    });

    this.authService.activeAcl$.subscribe(acl => {
      if (!acl || !acl.id) return;

      this.acl = acl;

      if (!this.activatingAccount) {
        this.activatingAccount = !this.acl.account.active;
      }

      this.init();
    });

    this.authService.sixUser$.subscribe(user => {
      if (!user || !user.id) return;

      this.user = user;

      if (!this.activatingUser) {
        this.activatingUser = !this.user.active;
      }

      this.init();
    });
  }

  init() {
    if (this.inited || !this.user || !this.acl) return;

    this.inited = true;

    if (this.activatingUser || this.activatingAccount) {
      this.showProgress = this.activatingAccount;
      this.setActivationInProgress();
      return;
    }

    if (!this.acl.account.billing || this.acl.account.billing.disabled) {
      this.showProgress = true;
      this.setPlanInProgress();
      return;
    }
  }

  changePlanEmitted() {
    this.setPlanInProgress();
  }

  submitRegistration() {
    this.formInvalid = !this.formValid();

    if (this.formInvalid) return;

    this.requestInProgress = true;

    if (this.activatingUser) {
      this.activateUser();
    } else if (this.activatingAccount) {
      this.activateAccount();
    } else {
      this.registrationCompleted();
    }
  }

  private activateAccount() {
    this.authService.updateCurrentAccount(this.companyName).subscribe(res => {
      if (res instanceof CustomServerError) {
        this.requestInProgress = false;
        return;
      }

      const account = new Account(res.body.response.data.updateaccount);

      this.aclService.updateUserAclTermsAndConditions(this.acl, this.ownerTerms.version).take(1).subscribe(data => {
        if (data instanceof CustomServerError) {
          return;
        }

        this.acl.account = account;
        this.acl.termsAndConditionsOutdated = false;
        this.authService.changeActiveAcl(this.acl, true);

        this.registrationCompleted();
      });
    });
  }

  private activateUser() {
    this.authService.registerUser(this.companyName, this.firstName, this.lastName, this.userTerms.version).subscribe(res => {
      if (res instanceof CustomServerError) {
        this.requestInProgress = false;
        return;
      }

      const user = new User(res.body.response.data.updateuser);

      this.authService.updateSixUser(user);

      if (this.activatingAccount) {
        this.activateAccount();
      } else {
        this.registrationCompleted();
      }
    })
  }

  formValid() {
    let valid: boolean = true;

    if (this.activatingUser) {
      valid = !!this.firstName && !!this.lastName
    }

    if (this.activatingAccount) {
      valid = valid && !!this.companyName;
    }

    return valid;
  }

  registrationCompleted() {
    this.authService.setActive(true);

    if (this.activatingAccount) {
      this.requestInProgress = false;
      this.setPlanInProgress();
    } else {
      const redirectRoute = this.authService.isActiveAclCustomerService() ? '/customer-service' :'/dashboard';
      this.router.navigate([redirectRoute]);
    }
  }

  setActivationInProgress() {
    this.accountInProgress = true;
    this.planInProgress = false;
    this.paymentInProgress = false;
  }

  setPlanInProgress() {
    this.accountInProgress = false;
    this.planInProgress = true;
    this.paymentInProgress = false;
  }

  setPaymentInProgress() {
    this.accountInProgress = false;
    this.planInProgress = false;
    this.paymentInProgress = true;
  }

  openUserTerms() {
    if (!this.userTerms) return;

    this.openTerms(this.userTerms.title, this.userTerms.body);
  }

  openOwnerTerms() {
    if (!this.ownerTerms) return;

    this.openTerms(this.ownerTerms.title, this.ownerTerms.body);
  }

  setSelectedPlan(plan: Plan) {
    this.plan = plan;
    this.setPaymentInProgress();
  }

  accountRegistrationFinished() {
    this.accountInProgress = false;
    this.planInProgress = false;
    this.paymentInProgress = false;
    this.showProgress = false;
    this.showWelcome = true;

    setTimeout(() => {
      this.authService.getUserIntrospection({}, '/dashboard');
    }, 1000)
  }

  private openTerms(title: string, text: string) {
    let ref = this.dialog.open(TermsDialogComponent, { disableClose : true });
    ref.componentInstance.title = title;
    ref.componentInstance.text = text;

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    });
  }
}
