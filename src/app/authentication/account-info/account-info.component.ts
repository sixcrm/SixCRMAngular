import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector: 'account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  text: string;

  mapAcl = (acl: Acl) => acl.account.name;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.getSixUser().acls.length === 0) {
      this.text = 'You don\'t have any account. Please create a new Account.';
    } else if (!this.authService.getActiveAcl().account.active) {
      this.text = 'This account is not active. Please contact Account Owner.';
    } else if (this.authService.getActiveAcl().role.isDisabled()) {
      this.text = 'Your access to this account has been disabled. Please contact Account Owner.';
    } else if (this.authService.getActiveAcl().role.isNoPermissions()) {
      this.text = 'Your don\'t have permissions to access this account. Please contact Account Owner.';
    } else {
      this.text = 'There are some issues with this account. Please contact Account Owner.';
    }
  }

  logout() {
    this.authService.logout();
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

}
