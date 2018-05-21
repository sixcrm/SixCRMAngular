import 'rxjs/add/operator/takeUntil';
import {DashboardIssueReportItem} from '../../dashboard-issues-report/dashboard-issues-report.component';
import {Component, OnInit, Input} from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {TranslatedQuote} from "../../../../translation/translated-quote.model";
import {Observable} from "rxjs/Observable";
import {TranslationService} from "../../../../translation/translation.service";
import {TransactionsService} from "../../../../shared/services/transactions.service";
import {CustomServerError} from "../../../../shared/models/errors/custom-server-error";
import {Transaction} from "../../../../shared/models/transaction.model";
import {HeroChartSeries} from "../../../../shared/models/hero-chart-series.model";
import {AnalyticsService} from "../../../../shared/services/analytics.service";
import {utc} from 'moment';

@Component({
  selector: 'c-dashboard-low-data',
  templateUrl: './dashboard-low-data.component.html',
  styleUrls: ['./dashboard-low-data.component.scss']
})
export class DashboardLowDataComponent implements OnInit {

  @Input() quote: TranslatedQuote;
  @Input() active: boolean;

  issueReports: DashboardIssueReportItem[] = [
    {label: 'Orders', issues: []},
    {label: 'Fulfillment', issues: []},
    {label: 'Billing', issues: []},
    {label: 'MIDS', issues: []}
  ];

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  name: string;
  revenue: any;
  transactions: Transaction[];
  showChart: boolean;

  constructor(
    private authService: AuthenticationService,
    private translationService: TranslationService,
    private transactionService: TransactionsService,
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

    this.transactionService.entities$.takeUntil(this.unsubscribe$).subscribe((transactions) => {

      if (transactions instanceof CustomServerError) return;

      this.transactions = transactions.sort((a,b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });

    });

    this.transactionService.getEntities(7);

    this.analyticsService.heroChartSeries$.subscribe(data => {
      if (!data || data instanceof CustomServerError) return;

      this.calculateRevenue(data);
    });

  }

  calculateRevenue(series: HeroChartSeries[]){
    let revenues = series.find(el => el.facet === 'revenue');
    if (!revenues) {
      return;
    }
    this.revenue = revenues.timeseries.map(s => s.value).reduce((a, b) => a+b, 0);
  }
}
