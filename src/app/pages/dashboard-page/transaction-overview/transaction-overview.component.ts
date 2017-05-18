import {Component, OnInit} from '@angular/core';
import {TransactionOverview} from '../../../shared/models/transaction-overview.model';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';

@Component({
  selector: 'transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss']
})
export class TransactionOverviewComponent extends AbstractDashboardItem implements OnInit {

  transactionOverview: TransactionOverview;

  overviewOptions: any[] = [
    {title: 'New Sales', mapToResult: (overview: TransactionOverview) => overview.newSale, image: 'newsale.svg'},
    {title: 'Main', mapToResult: (overview: TransactionOverview) => overview.main, image: 'main.svg'},
    {title: 'Upsells', mapToResult: (overview: TransactionOverview) => overview.upsell, image: 'upsell.svg'},
    {title: 'Rebills', mapToResult: (overview: TransactionOverview) => overview.rebill, image: 'rebill.svg'},
    {title: 'Declines', mapToResult: (overview: TransactionOverview) => overview.decline, image: 'decline.svg'},
    {title: 'Errors', mapToResult: (overview: TransactionOverview) => overview.error, image: 'error.svg'}
  ];

  constructor(public analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() { }

  fetch(): void {
    if (this.shouldFetch) {
      this.analyticsService.getTransactionOverview(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

}
