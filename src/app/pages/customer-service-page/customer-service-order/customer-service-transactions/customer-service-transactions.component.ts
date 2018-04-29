import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {TransactionsService} from '../../../../shared/services/transactions.service';
import {CustomerTransactionsComponent} from '../../../customers-page/customer-view/customer-transactions/customer-transactions.component';

@Component({
  selector: 'customer-service-transactions',
  templateUrl: './customer-service-transactions.component.html',
  styleUrls: ['./customer-service-transactions.component.scss']
})
export class CustomerServiceTransactionsComponent extends CustomerTransactionsComponent implements OnInit, OnDestroy {

  constructor(
    transactionsService: TransactionsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router
  ) {
    super(transactionsService, auth, dialog, paginationService, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
