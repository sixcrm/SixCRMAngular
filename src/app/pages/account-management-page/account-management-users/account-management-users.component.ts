import { Component, OnInit } from '@angular/core';
import {AccountsService} from '../../../shared/services/accounts.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Account} from '../../../shared/models/account.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Acl} from '../../../shared/models/acl.model';

@Component({
  selector: 'account-management-users',
  templateUrl: './account-management-users.component.html',
  styleUrls: ['./account-management-users.component.scss']
})
export class AccountManagementUsersComponent implements OnInit {

  account: Account;
  filterString: string;
  filterFunction = (acl: Acl) => acl.user.email;

  constructor(private accountService: AccountsService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.accountService.entity$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) {
        return;
      }

      this.account = account;
    });

    this.accountService.getEntity(this.authService.getActiveAcl().account.id);
  }

}
