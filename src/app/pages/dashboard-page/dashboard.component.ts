import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {Campaign} from '../../shared/models/campaign.model';
import {DashboardQuery, DashboardTimeFilter} from './dashboard.exports';
import {CampaignsService} from '../../shared/services/campaigns.service';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Currency} from '../../shared/utils/currency/currency';
import {AuthenticationService} from '../../authentication/authentication.service';
import {DashboardIssueReportItem} from './dashboard-issues-report/dashboard-issues-report.component';
import {TranslationService} from "../../translation/translation.service";
import {Observable} from "rxjs/Observable";
import {TranslatedQuote} from "../../translation/translated-quote.model";
import {AnalyticsService} from "../../shared/services/analytics.service";
import {utc} from 'moment';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  campaigns: Campaign[] = [new Campaign({name: 'All Campaigns'})];
  selectedCampaign: Campaign = this.campaigns[0];

  queries: DashboardQuery[] = [
    {label: 'Revenue vs Orders', selected: true},
    {label: 'Orders vs Upsells', selected: false},
    {label: 'Direct $ vs Rebill $', selected: false},
    {label: 'Average $ per Order', selected: false}
  ];
  selectedQuery: DashboardQuery = this.queries[0];

  timeFilters: DashboardTimeFilter[] = [
    {
      label: 'Lifetime',
      start: utc().subtract(365, 'd').format(),
      end: utc().format(),
      selected: false,
      callback: () => {
        this.fetchData();
        this.revenueMessage = 'Lifetime Total Revenue';
      }
    },
    {
      label: 'Past 30 Days',
      start: utc().subtract(30, 'd').format(),
      end: utc().format(),
      selected: true,
      callback: () => {
        this.fetchData();
        this.revenueMessage = 'Last 30 Days Revenue';
      }
    }
  ];

  totalAmount: Currency = new Currency(0);
  revenueMessage: string = 'Lifetime Total Revenue';

  name: string;
  quote: TranslatedQuote;

  data = [];

  issueReports: DashboardIssueReportItem[] = [
    {label: 'Orders', issues: []},
    {label: 'Fulfillment', issues: []},
    {label: 'Billing', issues: []},
    {label: 'MIDS', issues: []}
  ];

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private authService: AuthenticationService,
    private analyticsService: AnalyticsService,
    private campaignService: CampaignsService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe(user => {
      this.name = user.firstName;
    });

    this.campaignService.entities$.take(1).takeUntil(this.unsubscribe$).subscribe(campaigns => {
      if (campaigns instanceof CustomServerError) return;

      this.campaigns = [...this.campaigns, ...campaigns];
    });

    this.campaignService.getEntities(null, null, {ignoreProgress: true});

    let quoteSub = Observable.interval(50).take(40).subscribe(() => {
      if (!this.quote) {
        this.quote = this.translationService.getRandomQuote();
      } else {
        quoteSub.unsubscribe();
      }
    });

    this.analyticsService.orderVsRevenue$.subscribe(data => {
      if (!data || data instanceof CustomServerError) return;

      const reducer = (arr, val) => {
        if (arr.length === 0) return arr.concat([val]);

        const v = [val[0], val[1] + arr[arr.length - 1][1]];

        return arr.concat([v]);
      };

      const o = data.map(ovr => [ovr.datetime, ovr.orders]).reduce(reducer, []);
      const r = data.map(ovr => [ovr.datetime, ovr.revenue]).reduce(reducer, []);

      this.data = [r, o];
      this.totalAmount = new Currency(r.length > 0 ? r[r.length - 1][1] : 0);
    });

    this.fetchData();
  }

  fetchData() {
    const selectedTimeFilter = this.timeFilters.find((tf) => tf.selected);

    if (!selectedTimeFilter) return;

    this.analyticsService.getOrderVsRevenue(selectedTimeFilter.start, selectedTimeFilter.end, 'day', this.selectedCampaign ? this.selectedCampaign.id : null);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  selectCampaign(campaign: Campaign) {
    this.selectedCampaign = campaign;

    this.fetchData()
  }

  selectQuery(query: DashboardQuery) {
    this.selectedQuery.selected = false;

    this.selectedQuery = query;
    this.selectedQuery.selected = true;
  }

  selectTimeFilter(filter: DashboardTimeFilter) {
    this.timeFilters.forEach(f => f.selected = (f === filter));

    filter.callback();
  }
}
