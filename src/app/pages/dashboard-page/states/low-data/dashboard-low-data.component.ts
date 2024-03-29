import {DashboardIssueReportItem} from '../../dashboard-issues-report/dashboard-issues-report.component';
import {Component, OnInit, Input} from '@angular/core';
import {AsyncSubject, Observable} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {TranslatedQuote} from "../../../../translation/translated-quote.model";
import {TranslationService} from "../../../../translation/translation.service";
import {CustomServerError} from "../../../../shared/models/errors/custom-server-error";
import {AnalyticsService} from "../../../../shared/services/analytics.service";
import * as moment from 'moment-timezone';
import {TransactionAnalytics} from '../../../../shared/models/analytics/transaction-analytics.model';
import {Currency} from '../../../../shared/utils/currency/currency';

@Component({
  selector: 'c-dashboard-low-data',
  templateUrl: './dashboard-low-data.component.html',
  styleUrls: ['./dashboard-low-data.component.scss']
})
export class DashboardLowDataComponent implements OnInit {

  @Input() quote: TranslatedQuote;
  @Input() renderLowChart: boolean;

  issueReports: DashboardIssueReportItem[] = [
    {label: 'Orders', issues: []},
    {label: 'Fulfillment', issues: []},
    {label: 'Billing', issues: []},
    {label: 'MIDS', issues: []}
  ];

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  name: string;
  revenue: Currency;
  transactions: TransactionAnalytics[];

  constructor(
    private authService: AuthenticationService,
    private translationService: TranslationService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe(user => {
      this.name = user.firstName;
    });

    let quoteSub = Observable.interval(50).take(40).subscribe(() => {
      if (!this.quote) {
        this.quote = this.translationService.getRandomQuote();
      } else {
        quoteSub.unsubscribe();
      }
    });

    this.analyticsService.getTransactions(
      {
        start: moment().subtract(10, 'y').format(),
        end: moment().format(),
        limit: 7,
        offset: 0,
        orderBy: 'datetime',
        sort: 'desc',
        facets: []
      }
    ).subscribe((transactions) => {
      if (transactions instanceof CustomServerError) {
        this.transactions = [];

        return;
      }

      this.transactions = transactions;
    });

    this.analyticsService.transactionsLifetimeRevenue$.subscribe(data => {
      if (!data || data instanceof CustomServerError) return;

      this.revenue = new Currency(data);
    });

    this.analyticsService.getTransactionsLifetimeRevenue();
  }
}
