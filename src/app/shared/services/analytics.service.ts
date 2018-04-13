import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {EventFunnel} from '../models/event-funnel.model';
import {Response} from '@angular/http';
import {TransactionOverview} from '../models/transaction-overview.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {
  transactionSummaryQuery, transactionOverviewQuery, eventsFunnelQuery,
  campaignDeltaQuery, eventsByAffiliateQuery, eventsSummaryQuery, transactionsByAffiliateQuery, campaignsByAmountQuery,
  activitiesByCustomer, heroChartQuery
} from '../utils/queries/analytics.queries';
import {CampaignDelta} from '../models/campaign-delta.model';
import {EventSummary} from '../models/event-summary.model';
import {CampaignStats} from '../models/campaign-stats.model';
import {AnalyticsStorageService} from './analytics-storage.service';
import {TransactionsBy} from '../models/analytics/transaction-by.model';
import {EventsBy} from '../models/analytics/events-by.model';
import {FilterTerm} from '../components/advanced-filter/advanced-filter.component';
import {downloadFile} from '../utils/file.utils';
import {Activity} from '../models/analytics/activity.model';
import {HttpWrapperService, extractData, generateHeaders, FailStrategy} from './http-wrapper.service';
import {CustomServerError} from '../models/errors/custom-server-error';
import {SubscriptionStats} from "../models/subscription-stats.model";
import {Currency} from "../utils/currency/currency";
import {HeroChartSeries} from '../models/hero-chart-series.model';

@Injectable()
export class AnalyticsService {

  eventFunnel$: BehaviorSubject<EventFunnel | CustomServerError>;
  transactionsSummaries$: BehaviorSubject<TransactionSummary[] | CustomServerError>;
  heroChartSeries$: BehaviorSubject<HeroChartSeries[] | CustomServerError>;
  transactionsOverview$: BehaviorSubject<TransactionOverview | CustomServerError>;
  campaignDelta$: BehaviorSubject<CampaignDelta[] | CustomServerError>;
  eventsBy$: BehaviorSubject<EventsBy | CustomServerError>;
  transactionsBy$: BehaviorSubject<TransactionsBy | CustomServerError>;
  eventsSummary$: BehaviorSubject<EventSummary[] | CustomServerError>;
  campaignsByAmount$: BehaviorSubject<CampaignStats[] | CustomServerError>;
  subscriptionsByAmount$: BehaviorSubject<SubscriptionStats[] | CustomServerError>;

  activitiesByCustomer$: Subject<Activity[] | CustomServerError>;

  constructor(private authService: AuthenticationService, private analyticsStorage: AnalyticsStorageService, private http: HttpWrapperService) {
    this.eventFunnel$ = new BehaviorSubject(null);
    this.transactionsSummaries$ = new BehaviorSubject(null);
    this.heroChartSeries$ = new BehaviorSubject(null);
    this.transactionsOverview$ = new BehaviorSubject(null);
    this.campaignDelta$ = new BehaviorSubject(null);
    this.eventsBy$ = new BehaviorSubject(null);
    this.eventsSummary$ = new BehaviorSubject(null);
    this.transactionsBy$ = new BehaviorSubject(null);
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

  getTransactionOverview(start: string, end: string, downloadFormat?: string): void {
    const overviewStorage = this.analyticsStorage.getTransactionOverview(start, end);
    if (!downloadFormat && overviewStorage) {
      this.transactionsOverview$.next(overviewStorage);
      return;
    }

    this.queryRequest(transactionOverviewQuery(start, end), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'transactions-overview', downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.transactionsOverview$,
        (t: any) => new TransactionOverview(t),
        (data: any) => extractData(data).transactionoverview.overview
      );

      if (result) {
        this.analyticsStorage.setTransactionOverview(start, end, result);
      }
    })
  }

  getEventFunnel(start: string, end: string, downloadFormat?: string): void {
    const funnelStorage = this.analyticsStorage.getEventFunnel(start, end);
    if (!downloadFormat && funnelStorage) {
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

      let extracted = extractData(data).eventfunnel.funnel;
      let transformed = {};

      for (let i = 0; i < extracted.length; i++) {
        transformed[extracted[i].name] = extracted[i];
      }

      const funnel = new EventFunnel(transformed);

      this.eventFunnel$.next(funnel);
      this.analyticsStorage.setEventFunnel(start, end, funnel);
    })
  }

  getCampaignDelta(start: string, end: string, downloadFormat?: string): void {
    const deltaStorage = this.analyticsStorage.getCampaignsDelta(start, end);
    if (!downloadFormat && deltaStorage) {
      this.campaignDelta$.next(deltaStorage);
      return;
    }

    this.queryRequest(campaignDeltaQuery(start, end), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'campaigns-delta', downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.campaignDelta$,
        (t: any) => new CampaignDelta(t),
        (data: any) => extractData(data).campaigndelta.campaigns
      );

      if (result) {
        this.analyticsStorage.setCampaignsDelta(start, end, result);
      }
    })
  }

  getEventsBy(start: string, end: string, downloadFormat?: string): void {
    const eventsStorage = this.analyticsStorage.getEventsBy(start, end);
    if (!downloadFormat && eventsStorage) {
      this.eventsBy$.next(eventsStorage);
      return
    }

    this.queryRequest(eventsByAffiliateQuery(start, end), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'events-by-affiliate', downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.eventsBy$,
        (t: any) => new EventsBy(t),
        (data: any) => extractData(data).eventsbyfacet
      );

      if (result) {
        this.analyticsStorage.setEventsBy(start, end, result);
      }
    });
  }

  getTransactionsBy(start: string, end: string, downloadFormat?: string): void {
    const transactionsStorage = this.analyticsStorage.getTransactionsBy(start, end);
    if (!downloadFormat && transactionsStorage) {
      this.transactionsBy$.next(transactionsStorage);
      return;
    }

    this.queryRequest(transactionsByAffiliateQuery(start, end), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'transactions-by-affiliate', downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.transactionsBy$,
        (t: any) => new TransactionsBy(t),
        (data: any) => extractData(data).transactionsbyfacet
      );

      if (result) {
        this.analyticsStorage.setTransactionsBy(start, end, result);
      }
    });
  }

  getEventsSummary(start: string, end: string, downloadFormat?: string): void {
    const summaryStorage = this.analyticsStorage.getEventSummary(start, end);
    if (!downloadFormat && summaryStorage) {
      this.eventsSummary$.next(summaryStorage);
      return;
    }

    this.queryRequest(eventsSummaryQuery(start, end), downloadFormat).subscribe(data => {
      if (downloadFormat) {
        downloadFile(data, 'events-summary', downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.eventsSummary$,
        (t: any) => new EventSummary(t),
        (data: any) => extractData(data).eventsummary.events
      );
      if (result) {
        this.analyticsStorage.setEventSummary(start, end, result);
      }
    })
  }

  getSubscriptionsByAmount(start: string, end: string, downloadFormat?: string): void {

    setTimeout(() => {
      this.subscriptionsByAmount$.next([
        {subscription: 'Example Sub 1', amount: new Currency(1802)},
        {subscription: 'Sub 2', amount: new Currency(1100)},
        {subscription: 'Sub 3', amount: new Currency(900)},
        {subscription: 'Example Sub 2', amount: new Currency(550)},
        {subscription: 'Sub 5', amount: new Currency(412)},
      ])
    }, 250);

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
        (data: any) => extractData(data).campaignsbyamount.campaigns
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
        (data: any) => extractData(data).listactivitybyidentifier.activity
      );
    })
  }

  hasPermission(operation: string): boolean {
    return this.authService.hasPermissions('analytics', operation)
  }

  clearAllSubjects(): void {
    this.eventFunnel$.next(null);
    this.transactionsSummaries$.next(null);
    this.transactionsOverview$.next(null);
    this.campaignDelta$.next(null);
    this.eventsBy$.next(null);
    this.eventsSummary$.next(null);
    this.transactionsBy$.next(null);
    this.campaignsByAmount$.next(null);
  }

  private handleResponse(
    response: Response | CustomServerError,
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

  private queryRequest(query: string, downloadFormat?: string | boolean): Observable<Response | CustomServerError> {

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
