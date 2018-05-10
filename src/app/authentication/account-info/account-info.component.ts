import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector: 'account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  title: string;
  text: string;

  mapAcl = (acl: Acl) => acl.account.name;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    if (this.accountHasNoBilling()) {
      this.title = 'Account Disabled';
      this.text = 'Your account has been suspended due to a problem with payment.';
    } else if (this.noAvailableAccounts()) {
      this.title = 'No Available Accounts';
      this.text = 'You do not have permission to view any active accounts. Contact an administrator for access, or create your own account.';
    } else if (this.accountInactive()) {
      this.title = 'Account Inactive';
      this.text = 'You cannot currently sign in to this account. Please contact your administrator for more information.';
    } else if (this.userHasNoPermissions()) {
      this.title = 'No Permissions';
      this.text = 'You do not have permissions to view content for this account. Contact an administrator for access.';
    } else {
      this.title = 'Account Issues';
      this.text = 'There are some issues with this account. Please contact Account Owner.';
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
    return !this.authService.getActiveAcl().account.billing;
  }

  logout() {
    this.authService.logout();
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

}
