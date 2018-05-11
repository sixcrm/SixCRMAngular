import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Acl} from '../../shared/models/acl.model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  mapAcl = (acl: Acl) => acl.account.name;

  sidenavLogo = environment.branding ? environment.branding.infoScreensLogo : 'logo-white.svg';

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

  getText() {
    if (this.noAvailableAccounts()) {
      return 'You do not have permission to view any active accounts. Contact an administrator for access, or create your own account.';
    } else if (this.accountHasNoBilling()) {
      return 'Your account must have payment plan selected in order to continue';
    } else if (this.accountInactive()) {
      return 'You cannot currently sign in to this account. Please contact your administrator for more information.';
    } else if (this.userHasNoPermissions()) {
      return 'You do not have permissions to view content for this account. Contact an administrator for access.';
    } else {
      return 'There are some issues with this account. Please contact Account Owner.';
    }
  }

  getTitle() {
    if (this.noAvailableAccounts()) {
      return 'No Available Accounts';
    } else if (this.accountHasNoBilling()) {
      return 'Select Payment Plan';
    } else if (this.accountInactive()) {
      return 'Account Inactive';
    } else if (this.userHasNoPermissions()) {
      return 'No Permissions';
    } else {
      return 'Account Issues';
    }
  }

  userHasNoPermissions() {
    return this.authService.getActiveAcl().role.isNoPermissions();
  }

  accountInactive() {
    return !this.authService.getActiveAcl().account.active;
  }

  noAvailableAccounts() {
    return this.authService.getSixUser().acls.length === 0;
  }

  accountHasNoBilling() {
    return this.authService.getSixUser().acls.length > 0 && !this.authService.getActiveAcl().account.billing;
  }

  logout() {
    this.authService.logout();
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

}
