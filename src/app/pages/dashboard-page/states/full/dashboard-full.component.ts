import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {DashboardQuery, DashboardTimeFilter} from '../../dashboard.exports';
import {AsyncSubject, Observable} from 'rxjs';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {Currency} from '../../../../shared/utils/currency/currency';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {DashboardIssueReportItem} from '../../dashboard-issues-report/dashboard-issues-report.component';
import {TranslationService} from "../../../../translation/translation.service";
import {TranslatedQuote} from "../../../../translation/translated-quote.model";
import {AnalyticsService} from "../../../../shared/services/analytics.service";
import * as moment from 'moment-timezone'
import {HeroChartSeries} from '../../../../shared/models/hero-chart-series.model';
import {SeriesType} from '../../series-type';

@Component({
  selector: 'c-dashboard-full',
  templateUrl: './dashboard-full.component.html',
  styleUrls: ['./dashboard-full.component.scss']
})
export class DashboardFullComponent implements OnInit, OnDestroy {

  @Input() renderFullChart: boolean;
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
      start: moment().subtract(365, 'd').format(),
      end: moment().format(),
      selected: false,
      callback: () => {
        this.fetchData();
        this.revenueMessage = 'Lifetime Total Revenue';
        this.graphTimeFilterData = 365;
      }
    },
    {
      label: 'Past 30 Days',
      start: moment().subtract(30, 'd').format(),
      end: moment().format(),
      selected: true,
      callback: () => {
        this.fetchData();
        this.revenueMessage = 'Last 30 Days Revenue';
        this.graphTimeFilterData = 30;
      }
    }
  ];

  totalAmount: Currency;
  revenueMessage: string = 'Last 30 Days Revenue';

  name: string;
  quote: TranslatedQuote;

  data = [];
  graphTimeFilterData: number = 30;

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
    private translationService: TranslationService
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

    this.analyticsService.heroChartSeries$.takeUntil(this.unsubscribe$).subscribe(data => {
      if (!data || data instanceof CustomServerError) return;

      this.selectedQuery.process(data);
    });

    this.fetchData();
  }

  fetchData() {
    const selectedTimeFilter = this.timeFilters.find((tf) => tf.selected);

    if (!selectedTimeFilter || !this.selectedQuery) return;

    this.analyticsService.getHeroChartSeries({
      start: selectedTimeFilter.start,
      end: selectedTimeFilter.end,
      period: 'day',
      comparisonType: this.selectedQuery.comparisonType,
      campaignId: null
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
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
