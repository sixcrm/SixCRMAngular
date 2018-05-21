import 'rxjs/add/operator/takeUntil';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {DashboardQuery, DashboardTimeFilter} from '../../dashboard.exports';
import {CampaignsService} from '../../../../shared/services/campaigns.service';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {Currency} from '../../../../shared/utils/currency/currency';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {DashboardIssueReportItem} from '../../dashboard-issues-report/dashboard-issues-report.component';
import {TranslationService} from "../../../../translation/translation.service";
import {Observable} from "rxjs/Observable";
import {TranslatedQuote} from "../../../../translation/translated-quote.model";
import {AnalyticsService} from "../../../../shared/services/analytics.service";
import {utc} from 'moment';
import {HeroChartSeries} from '../../../../shared/models/hero-chart-series.model';
import {SeriesType} from '../../series-type';

@Component({
  selector: 'c-dashboard-full',
  templateUrl: './dashboard-full.component.html',
  styleUrls: ['./dashboard-full.component.scss']
})
export class DashboardFullComponent implements OnInit, OnDestroy {

  campaigns: Campaign[] = [new Campaign({name: 'All Campaigns'})];
  selectedCampaign: Campaign = this.campaigns[0];
  seriesType: SeriesType = SeriesType.amountcount;

  queries: DashboardQuery[] = [
    {
      label: 'Revenue vs Orders',
      comparisonType: 'revenueVersusOrders',
      selected: true,
      process: (series: HeroChartSeries[]) => {
        this.seriesType = SeriesType.amountcount;

        const revenue = series.find(el => el.facet === 'revenue').timeseries.map(s => [s.datetime, s.value]);
        const orders = series.find(el => el.facet === 'orders').timeseries.map(s => [s.datetime, s.value]);

        this.totalAmount = new Currency(series.find(el => el.facet === 'revenue').timeseries.map(s => s.value).reduce((a,b) => a+b, 0));

        this.data = [revenue, orders];
      }
    },
    {
      label: 'Orders vs Upsells',
      comparisonType: 'ordersVersusUpsells',
      selected: false,
      process: (series: HeroChartSeries[]) => {
        this.seriesType = SeriesType.count;

        const orders = series.find(el => el.facet === 'orders').timeseries.map(s => [s.datetime, s.value]);
        const upsells = series.find(el => el.facet === 'upsells').timeseries.map(s => [s.datetime, s.value]);

        this.data = [upsells, orders];
      }
    },
    {
      label: 'Direct $ vs Rebill $',
      comparisonType: 'directVersusRebill',
      selected: false,
      process: (series: HeroChartSeries[]) => {
        this.seriesType = SeriesType.amount;

        const direct = series.find(el => el.facet === 'direct').timeseries.map(s => [s.datetime, s.value]);
        const rebill = series.find(el => el.facet === 'rebill').timeseries.map(s => [s.datetime, s.value]);

        this.data = [direct, rebill];
      }
    },
    {
      label: 'Average $ per Order',
      comparisonType: 'averageRevenuePerOrder',
      selected: false,
      process: (series: HeroChartSeries[]) => {
        this.seriesType = SeriesType.amount;

        const average = series.find(el => el.facet === 'averageRevenue').timeseries.map(s => [s.datetime, s.value]);

        this.data = [average, []];
      }
    }
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

    this.analyticsService.heroChartSeries$.subscribe(data => {
      if (!data || data instanceof CustomServerError) return;

      this.selectedQuery.process(data);
    });

    this.fetchData();
  }

  fetchData() {
    const selectedTimeFilter = this.timeFilters.find((tf) => tf.selected);

    if (!selectedTimeFilter || !this.selectedQuery) return;

    this.analyticsService.getHeroChartSeries(selectedTimeFilter.start, selectedTimeFilter.end, 'day', this.selectedQuery.comparisonType, this.selectedCampaign ? this.selectedCampaign.id : null);
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
    this.fetchData();
  }

  selectTimeFilter(filter: DashboardTimeFilter) {
    this.timeFilters.forEach(f => f.selected = (f === filter));

    filter.callback();
  }

}
