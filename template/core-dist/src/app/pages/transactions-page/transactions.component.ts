import { Component, OnInit } from '@angular/core';
import {TransactionsService} from "../../shared/services/transactions.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Transaction} from '../../shared/models/transaction.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends AbstractEntityIndexComponent<Transaction> implements OnInit {

  private transactions: Transaction[] = [];

  constructor(private transactionsService: TransactionsService, router: Router, route: ActivatedRoute, dialog: MdDialog) {
    super(transactionsService, router, route, dialog);
  }

  ngOnInit() {
    this.transactionsService.entities$.subscribe((data) => this.transactions = data);
    this.transactionsService.getEntities();
  }

}
