import { Component, OnInit } from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {TransactionsService} from '../../../shared/services/transactions.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent implements OnInit {

  private transaction: Transaction;

  constructor(private transactionsService: TransactionsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.transactionsService.transaction$.subscribe((transaction: Transaction) => {
      console.log(transaction);
      this.transaction = transaction;
    });
    this.route.params.subscribe((params: Params) => {
      this.transactionsService.getTransaction(params['id']);
    });
  }

}
