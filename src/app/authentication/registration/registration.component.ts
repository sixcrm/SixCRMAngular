import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {Acl} from '../../shared/models/acl.model';
import {User} from '../../shared/models/user.model';
import {Account} from '../../shared/models/account.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {UsersService} from '../../entity-services/services/users.service';
import {TermsDialogComponent} from '../../dialog-modals/terms-dialog/terms-dialog.component';
import {MatDialog} from '@angular/material';
import {AccountsService} from '../../entity-services/services/accounts.service';
import {environment} from '../../../environments/environment';

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

  userTerms: Terms;

  activatingAccount: boolean;
  activatingUser: boolean;

  requestInProgress: boolean;
  duplicateAccountError: boolean;

  inited: boolean;
  showProgress: boolean;

  mapAcl = (acl: Acl) => acl.account.name;

  sidenavLogo = environment.branding ? environment.branding.sidenavLogo : 'logo-white.svg';

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private userService: UsersService,
    private dialog: MatDialog,
    private accountService: AccountsService
  ) { }

  ngOnInit() {
    this.duplicateAccountError = false;

    const payload = this.authService.getPayload();

    this.firstName = payload.given_name;
    this.lastName = payload.family_name;

    this.userService.getlatestTermsAndConditions().take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.userTerms = response.body.response.data.latesttermsandconditions;
    });

    this.authService.activeAcl$.subscribe(acl => {
      if (!acl || !acl.id) return;

      this.acl = acl;

      if (!this.activatingAccount) {
        this.activatingAccount = this.acl.account.isNew();
      }

      this.init();
    });

    this.authService.sixUser$.subscribe(user => {
      if (!user || !user.id) return;

      this.user = user;

      if (!this.activatingUser) {
        this.activatingUser = !this.user.active;

        if (this.user.acls.length === 0) {
          this.activatingAccount = true;
        }
      }

      this.init();
    });
  }

  init() {
    if (this.inited || (!this.user && !this.acl)) return;

    this.inited = true;

    this.showProgress = this.activatingAccount;
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
      this.authService.getUserIntrospection({}, '/payment', true);
    }
  }

  private activateAccount() {
    if (this.acl) {
      this.updateExistingAccount();
    } else {
      this.createNewAccount();
    }
  }

  private createNewAccount() {
    this.requestInProgress = true;

    this.accountService.createNewAccount(this.companyName).subscribe(account => {
      if (account instanceof CustomServerError) {
        this.duplicateAccountError = true;
        this.formInvalid = true;
        this.requestInProgress = false;
        return;
      }

      this.authService.getUserIntrospection({}, '/payment', true);
    })
  }

  private updateExistingAccount() {
    this.authService.updateCurrentAccount(this.companyName).subscribe(res => {
      if (res instanceof CustomServerError) {
        this.duplicateAccountError = true;
        this.formInvalid = true;
        this.requestInProgress = false;
        return;
      }

      this.acl.account = new Account(res.body.response.data.updateaccount);
      this.authService.changeActiveAcl(this.acl, true);

      this.registrationCompleted();
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
    this.duplicateAccountError = false;
    this.authService.setActive(true);

    if (this.authService.getActiveAcl().account.hasBillingIssue()) {
      if (this.authService.getActiveAcl().role.name === 'Owner') {
        this.router.navigate(['/payment']);
      } else {
        this.router.navigate(['/billing-disable']);
      }
    } else {
      const redirectRoute = this.authService.isActiveAclCustomerService() ? '/customer-service' :'/dashboard';
      this.router.navigate([redirectRoute], {queryParams: { w: true }});
    }
  }

  openUserTerms() {
    if (!this.userTerms) return;

    this.openTerms(this.userTerms.title, this.userTerms.body);
  }

  resetError() {
    this.duplicateAccountError = false;
  }

  signout() {
    this.authService.logout();
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

  private openTerms(title: string, text: string) {
    let ref = this.dialog.open(TermsDialogComponent);
    ref.componentInstance.title = title;
    ref.componentInstance.text = text;

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    });
  }
}
