import { Component, OnInit, Input } from '@angular/core';
import {TransactionOverview, TransactionOverviewResult} from '../../../shared/models/transaction-overview.model';

@Component({
  selector: 'transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss']
})
export class TransactionOverviewComponent implements OnInit {

  @Input()
  overview: TransactionOverview;

  @Input()
  title: string;

  @Input()
  mapToResult: (overview: TransactionOverview) => TransactionOverviewResult;

  constructor() { }

  ngOnInit() { }

}
