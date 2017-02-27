import { Component, OnInit } from '@angular/core';
import {TransactionsService} from "../../shared/services/transactions.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Transaction} from '../../shared/models/transaction.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends AbstractEntityIndexComponent<Transaction> implements OnInit {

  constructor(
    private transactionsService: TransactionsService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService

  ) {
    super(transactionsService, router, route, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.transactionsService.entityDeleted$.subscribe((data) => this.transactionsService.getEntities());

    this.init();
  }

}
