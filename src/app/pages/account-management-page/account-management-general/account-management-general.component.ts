import { Component, OnInit } from '@angular/core';
import {AccountsService} from '../../../shared/services/accounts.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Account} from '../../../shared/models/account.model';

@Component({
  selector: 'account-management-general',
  templateUrl: './account-management-general.component.html',
  styleUrls: ['./account-management-general.component.scss']
})
export class AccountManagementGeneralComponent implements OnInit {

  account: Account;
  accountBackup: Account;

  constructor(
    private accountService: AccountsService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.accountService.entity$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
      this.accountBackup = this.account.copy();
    });

    this.accountService.getEntity(this.authService.getActiveAcl().account.id);
  }

  cancelAccountUpdate() {
    this.accountBackup = this.account.copy();
  }

  updateCustomer() {
    this.accountService.entityUpdated$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
      this.accountBackup = this.account.copy();
    });

    this.accountService.updateEntity(this.accountBackup);
  }

}
