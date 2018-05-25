import { Component, OnInit } from '@angular/core';
import {AccountsService} from '../../../shared/services/accounts.service';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'account-management-general',
  templateUrl: './account-management-general.component.html',
  styleUrls: ['./account-management-general.component.scss']
})
export class AccountManagementGeneralComponent implements OnInit {

  account: Account;

  constructor(
    private accountService: AccountsService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.account = this.authService.getActiveAcl().account.copy();
  }

}
