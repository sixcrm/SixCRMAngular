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
      return 'INFOSCREEN_NOACCOUNTS_TEXT';
    } else if (this.accountHasNoBilling()) {
      return 'INFOSCREEN_NOBILLING_TEXT';
    } else if (this.accountInactive()) {
      return 'INFOSCREEN_INACTIVE_TEXT';
    } else if (this.userHasNoPermissions()) {
      return 'INFOSCREEN_NOPERMISSIONS_TEXT';
    } else {
      return 'INFOSCREEN_OTHER_TEXT';
    }
  }

  getTitle() {
    if (this.noAvailableAccounts()) {
      return 'INFOSCREEN_NOACCOUNTS_TITLE';
    } else if (this.accountHasNoBilling()) {
      return 'INFOSCREEN_NOBILLING_TITLE';
    } else if (this.accountInactive()) {
      return 'INFOSCREEN_INACTIVE_TITLE';
    } else if (this.userHasNoPermissions()) {
      return 'INFOSCREEN_NOPERMISSIONS_TITLE';
    } else {
      return 'INFOSCREEN_OTHER_TITLE';
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
