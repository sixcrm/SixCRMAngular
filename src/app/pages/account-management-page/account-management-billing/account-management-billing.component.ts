import { Component, OnInit } from '@angular/core';
import {BillsService} from '../../../shared/services/bills.service';
import {Bill} from '../../../shared/models/bill.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'account-management-billing',
  templateUrl: './account-management-billing.component.html',
  styleUrls: ['./account-management-billing.component.scss']
})
export class AccountManagementBillingComponent implements OnInit {

  overdue: Bill[] = [];
  paid: Bill[] = [];
  unpaid: Bill[] = [];

  constructor(private billsService: BillsService) { }

  ngOnInit() {
    this.billsService.entities$.take(1).subscribe(bills => {
      if (bills instanceof CustomServerError) {
        return;
      }

      this.overdue = bills.filter(bill => bill.outstanding);
      this.paid = bills.filter(bill => !bill.outstanding && bill.paid);
      this.unpaid = bills.filter(bill => !bill.outstanding && !bill.paid);
    });

    this.billsService.getEntities(10);
  }

}
