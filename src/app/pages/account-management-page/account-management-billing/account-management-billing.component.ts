import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Account} from '../../../shared/models/account.model';
import {HttpWrapperCustomerService} from '../../../shared/services/http-wrapper-customer.service';
import {Session} from '../../../shared/models/session.model';
import {Rebill} from '../../../shared/models/rebill.model';
import {utc} from 'moment';

@Component({
  selector: 'account-management-billing',
  templateUrl: './account-management-billing.component.html',
  styleUrls: ['./account-management-billing.component.scss']
})
export class AccountManagementBillingComponent implements OnInit {

  account: Account;
  session: Session;

  lastBill: Rebill;

  constructor(private authService: AuthenticationService, private customerGraphAPI: HttpWrapperCustomerService) { }

  ngOnInit() {
    this.account = this.authService.getActiveAcl().account;

    this.fetchSession();
  }

  fetchSession() {
    const currentAcc = this.authService.getActiveAcl().account;

    if (currentAcc.billing && currentAcc.billing.session) {
      this.customerGraphAPI.fetchSessionInfo(currentAcc.billing.session).subscribe(session => {
        this.session = session;

        this.lastBill = this.session.rebills
          .filter(rebill => rebill.billAt.isBefore(utc()))
          .sort((f,s) => {
            if (f.billAt.isAfter(s.billAt)) return 1;
            if (f.billAt.isBefore(s.billAt)) return -1;

            return 0;
          })[0];
      });
    }
  }
}
