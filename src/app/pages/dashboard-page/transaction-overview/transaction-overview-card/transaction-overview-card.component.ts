import { Component, OnInit, Input } from '@angular/core';
import {TransactionOverview, TransactionOverviewResult} from '../../../../shared/models/transaction-overview.model';

@Component({
  selector: 'transaction-overview-card',
  templateUrl: './transaction-overview-card.component.html',
  styleUrls: ['./transaction-overview-card.component.scss']
})
export class TransactionOverviewCardComponent implements OnInit {

  @Input()
  overview: TransactionOverview;

  @Input()
  title: string;

  @Input()
  mapToResult: (overview: TransactionOverview) => TransactionOverviewResult;

  @Input()
  image: string;

  constructor() { }

  ngOnInit() { }
}
