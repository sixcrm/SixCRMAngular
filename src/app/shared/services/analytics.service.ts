import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {EventFunnel} from '../models/event-funnel.model';
import {HttpResponse} from '@angular/common/http';
import {TransactionSummary} from '../models/transaction-summary.model';
import {
  transactionSummaryQuery, eventsFunnelQuery, campaignsByAmountQuery,
  activitiesByCustomer, heroChartQuery, eventsFunnelTimeseriesQuery
} from '../utils/queries/analytics.queries';
import {CampaignStats} from '../models/campaign-stats.model';
import {AnalyticsStorageService} from './analytics-storage.service';
import {FilterTerm} from '../components/advanced-filter/advanced-filter.component';
import {downloadFile} from '../utils/file.utils';
import {Activity} from '../models/analytics/activity.model';
import {HttpWrapperService, extractData, generateHeaders, FailStrategy} from './http-wrapper.service';
import {CustomServerError} from '../models/errors/custom-server-error';
import {SubscriptionStats} from "../models/subscription-stats.model";
import {Currency} from "../utils/currency/currency";
import {HeroChartSeries} from '../models/hero-chart-series.model';
import {EventFunnelTimeseries} from "../models/event-funnel-timeseries.model";

@Injectable()
export class AnalyticsService {

  eventFunnel$: BehaviorSubject<EventFunnel | CustomServerError>;
  eventFunnelTimeseries$: BehaviorSubject<EventFunnelTimeseries | CustomServerError>;
  transactionsSummaries$: BehaviorSubject<TransactionSummary[] | CustomServerError>;
  heroChartSeries$: BehaviorSubject<HeroChartSeries[] | CustomServerError>;
  campaignsByAmount$: BehaviorSubject<CampaignStats[] | CustomServerError>;
  subscriptionsByAmount$: BehaviorSubject<SubscriptionStats[] | CustomServerError>;

  activitiesByCustomer$: Subject<Activity[] | CustomServerError>;

  constructor(private authService: AuthenticationService, private analyticsStorage: AnalyticsStorageService, private http: HttpWrapperService) {
    this.eventFunnel$ = new BehaviorSubject(null);
    this.eventFunnelTimeseries$ = new BehaviorSubject(null);
    this.transactionsSummaries$ = new BehaviorSubject(null);
    this.heroChartSeries$ = new BehaviorSubject(null);
    this.campaignsByAmount$ = new BehaviorSubject(null);
    this.subscriptionsByAmount$ = new BehaviorSubject(null);

    this.activitiesByCustomer$ = new Subject();

    this.authService.activeAcl$.subscribe(() => {
      if (this.authService.active()) {
        this.clearAllSubjects();
        this.analyticsStorage.refresh();
      }
    });

    this.authService.actingAsAccount$.subscribe(() => {
      this.analyticsStorage.refresh();
    })
  }

  getHeroChartSeries(start: string, end: string, period: string, comparisonType: string, campaignId?: string): void {
    this.queryRequest(heroChartQuery(start, end, period, comparisonType, campaignId)).subscribe(data => {
      this.handleResponse(
        data,
        this.heroChartSeries$,
        (t: any) => new HeroChartSeries(t),
        (data: any) => extractData(data).analytics.records[0]
      );
    })
  }

  getTransactionSummaries(start: string, end: string, filters: FilterTerm[], downloadFormat?: string): void {
    const summariesStorage = this.analyticsStorage.getTransactionSummaries(start, end, filters);

    if (!downloadFormat && summariesStorage) {
      this.transactionsSummaries$.next(summariesStorage);
      return;
    }

    this.queryRequest(transactionSummaryQuery(start, end, filters), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'transactions-summary', downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.transactionsSummaries$,
        (t: any) => new TransactionSummary(t),
        (data: any) => extractData(data).transactionsummary.transactions
      );

      if (result) {
        this.analyticsStorage.setTransactionSummaries(start, end, result, filters);
      }
    })
  }

  getEventFunnel(start: string, end: string, downloadFormat?: string, eventType?: string): void {
    const funnelStorage = this.analyticsStorage.getEventFunnel(start, end);
    if (!downloadFormat && funnelStorage && !eventType) {
      this.eventFunnel$.next(funnelStorage);
      return;
    }

    this.queryRequest(eventsFunnelQuery(start, end), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'events-by', downloadFormat);
        return;
      }

      if (data instanceof CustomServerError) {
        this.eventFunnel$.next(data);

        return;
      }

      let extracted = extractData(data).analytics.records;

      const funnel = new EventFunnel(extracted);

      this.eventFunnel$.next(funnel);
      this.analyticsStorage.setEventFunnel(start, end, funnel);
    });

    this.queryRequest(eventsFunnelTimeseriesQuery(start, end, "DAY", eventType)).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.eventFunnelTimeseries$.next(data);

        return;
      }

      let extracted = extractData(data).analytics.records;

      const timeseries = new EventFunnelTimeseries(extracted);

      this.eventFunnelTimeseries$.next(timeseries);
    })
  }

  getSubscriptionsByAmount(start: string, end: string, downloadFormat?: string): void {
    const subsStorage = this.analyticsStorage.getSubscriptionsByAmount(start, end);

    if (!downloadFormat && subsStorage) {
      this.subscriptionsByAmount$.next(subsStorage);
      return;
    }

    const data = [
      {subscription: 'Example Sub 1', amount: new Currency(1802)},
      {subscription: 'Sub 2', amount: new Currency(1100)},
      {subscription: 'Sub 3', amount: new Currency(900)},
      {subscription: 'Example Sub 2', amount: new Currency(550)},
      {subscription: 'Sub 5', amount: new Currency(412)},
    ];

    if (downloadFormat) {
      downloadFile(data, 'subscriptions-by-amount', downloadFormat);
      return;
    }

    setTimeout(() => {
      this.subscriptionsByAmount$.next([
        {subscription: 'Example Sub 1', amount: new Currency(1802)},
        {subscription: 'Sub 2', amount: new Currency(1100)},
        {subscription: 'Sub 3', amount: new Currency(900)},
        {subscription: 'Example Sub 2', amount: new Currency(550)},
        {subscription: 'Sub 5', amount: new Currency(412)},
      ])
    }, 250);

    if (data) {
      this.analyticsStorage.setSubscriptionsByAmount(start, end, data);
    }
  }

  getCampaignsByAmount(start: string, end: string, downloadFormat?: string): void {
    const campaignsStorage = this.analyticsStorage.getCampaignsByAmount(start, end);
    if (!downloadFormat && campaignsStorage) {
      this.campaignsByAmount$.next(campaignsStorage);
      return;
    }

    this.queryRequest(campaignsByAmountQuery(start, end), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'campaigns-by-amount', downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.campaignsByAmount$,
        (t: any) => new CampaignStats(t),
        (data: any) => extractData(data).analytics.records
      );
      if (result) {
        this.analyticsStorage.setCampaignsByAmount(start, end, result);
      }
    })
  }

  getActivityByCustomer(start: string, end: string, customer: string, limit: number, offset: number) {
    if (!this.hasPermission('getActivityByIdentifier')) return;

    this.queryRequest(activitiesByCustomer(start, end, customer, limit, offset)).subscribe(data => {
      this.handleResponse(
        data,
        this.activitiesByCustomer$,
        (t: any) => new Activity(t),
        (data: any) => extractData(data).analytics.records
      );
    })
  }

  hasPermission(operation: string): boolean {
    return this.authService.hasPermissions('analytics', operation)
  }

  clearAllSubjects(): void {
    this.heroChartSeries$.next(null);
    this.eventFunnel$.next(null);
    this.transactionsSummaries$.next(null);
    this.campaignsByAmount$.next(null);
    this.subscriptionsByAmount$.next(null);
  }

  private handleResponse(
    response: HttpResponse<any> | CustomServerError,
    dataStream: Subject<any | CustomServerError>,
    mapFunction: (el: any) => any,
    extractFunction: (el: any) => any[]
  ): any {
    if (response instanceof CustomServerError) {
      dataStream.next(response);

      return;
    }

    const entities = extractFunction(response);

    if (!entities) return null;

    const e = entities instanceof Array ? entities.map(entity => mapFunction(entity)) : mapFunction(entities);

    dataStream.next(e);

    return e;
  }

  private queryRequest(query: string, downloadFormat?: string | boolean): Observable<HttpResponse<any> | CustomServerError> {

    let endpoint = environment.endpoint;

    if (this.authService.getActingAsAccount()) {
      endpoint += this.authService.getActingAsAccount().id;
    } else if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    if (downloadFormat) {
      endpoint += '?download=' + downloadFormat;
    }

    return this.http.postWithError(endpoint, query, { headers: generateHeaders(this.authService.getToken())}, {failStrategy: FailStrategy.Soft});
  }
}
