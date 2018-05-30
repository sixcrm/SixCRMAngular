import { Component, OnInit } from '@angular/core';
import {AccountsService} from '../../../shared/services/accounts.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Account} from '../../../shared/models/account.model';
import {HttpWrapperCustomerService} from '../../../shared/services/http-wrapper-customer.service';
import {Session} from '../../../shared/models/session.model';

@Component({
  selector: 'account-management-general',
  templateUrl: './account-management-general.component.html',
  styleUrls: ['./account-management-general.component.scss']
})
export class AccountManagementGeneralComponent implements OnInit {

  account: Account;
  accountBackup: Account;
  session: Session;

  constructor(
    private accountService: AccountsService,
    private authService: AuthenticationService,
    private customerGraphAPI: HttpWrapperCustomerService
  ) { }

  ngOnInit() {
    this.accountService.entity$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
      this.accountBackup = this.account.copy();
    });

    this.accountService.getEntity(this.authService.getActiveAcl().account.id);

    this.fetchSession();
  }

  fetchSession() {
    const currentAcc = this.authService.getActiveAcl().account;

    if (currentAcc.billing && currentAcc.billing.session) {
      this.customerGraphAPI.fetchSessionInfo(currentAcc.billing.session).subscribe(session => {
        this.session = session;
      });
    }
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
