import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {EventFunnel} from '../models/event-funnel.model';
import {HttpResponse} from '@angular/common/http';
import {TransactionSummary} from '../models/transaction-summary.model';
import {
  transactionSummaryQuery, eventsFunnelQuery, campaignsByAmountQuery,
  activitiesByCustomer, heroChartQuery, eventsFunnelTimeseriesQuery,
  productSchedulesByAmountQuery, analyticsDetailQuery
} from '../utils/queries/analytics.queries';
import {CampaignStats} from '../models/campaign-stats.model';
import {AnalyticsStorageService} from './analytics-storage.service';
import {FilterTerm} from '../models/filter-term.model';
import {downloadFile} from '../utils/file.utils';
import {Activity} from '../models/analytics/activity.model';
import {HttpWrapperService, extractData, generateHeaders, FailStrategy} from './http-wrapper.service';
import {CustomServerError} from '../models/errors/custom-server-error';
import {SubscriptionStats} from "../models/subscription-stats.model";
import {HeroChartSeries} from '../models/hero-chart-series.model';
import {EventFunnelTimeseries} from "../models/event-funnel-timeseries.model";
import {TransactionAnalytics} from '../models/analytics/transaction-analytics.model';
import {OrderAnalytics} from '../models/analytics/order-analytics.model';
import {MerchantAnalytics} from '../models/analytics/merchant-analytics.model';
import {AffiliateAnalytics} from '../models/analytics/affiliate-analytics.model';
import {CustomerAnalytics} from '../models/analytics/customer-analytics.model';

@Injectable()
export class AnalyticsService {

  eventFunnel$: BehaviorSubject<EventFunnel | CustomServerError>;
  eventFunnelTimeseries$: BehaviorSubject<EventFunnelTimeseries | CustomServerError>;
  eventFunnelSimple$: BehaviorSubject<EventFunnel | CustomServerError>;
  eventFunnelTimeseriesSimple$: BehaviorSubject<EventFunnelTimeseries | CustomServerError>;
  transactionsSummaries$: BehaviorSubject<TransactionSummary[] | CustomServerError>;
  heroChartSeries$: BehaviorSubject<HeroChartSeries[] | CustomServerError>;
  campaignsByAmount$: BehaviorSubject<CampaignStats[] | CustomServerError>;
  subscriptionsByAmount$: BehaviorSubject<SubscriptionStats[] | CustomServerError>;

  activitiesByCustomer$: Subject<Activity[] | CustomServerError>;

  constructor(private authService: AuthenticationService, private analyticsStorage: AnalyticsStorageService, private http: HttpWrapperService) {
    this.eventFunnel$ = new BehaviorSubject(null);
    this.eventFunnelTimeseries$ = new BehaviorSubject(null);
    this.eventFunnelSimple$ = new BehaviorSubject(null);
    this.eventFunnelTimeseriesSimple$ = new BehaviorSubject(null);
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

  getHeroChartSeries(params: {start: string, end: string, period: string, comparisonType: string, campaignId?: string}): void {
    this.queryRequest(heroChartQuery(params.start, params.end, params.period, params.comparisonType, params.campaignId)).subscribe(data => {
      this.handleResponse(
        data,
        this.heroChartSeries$,
        (t: any) => new HeroChartSeries(t),
        (data: any) => extractData(data).analytics.records[0]
      );
    })
  }

  getTransactionSummaries(params: {start: string, end: string, filters: FilterTerm[], downloadFormat?: string}): void {
    const summariesStorage = this.analyticsStorage.getTransactionSummaries(params.start, params.end, params.filters);

    if (!params.downloadFormat && summariesStorage) {
      this.transactionsSummaries$.next(summariesStorage);
      return;
    }

    this.queryRequest(transactionSummaryQuery(params.start, params.end, params.filters), params.downloadFormat).subscribe(data => {
      if (params.downloadFormat) {
        downloadFile(data, 'transactions-summary', params.downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.transactionsSummaries$,
        (t: any) => new TransactionSummary(t),
        (data: any) => extractData(data).analytics.records
      );

      if (result) {
        this.analyticsStorage.setTransactionSummaries(params.start, params.end, result, params.filters);
      }
    })
  }

  getEventFunnel(params: {start: string, end: string, downloadFormat?: string, eventType?: string, period?: string}): void {
    const funnelStorage = this.analyticsStorage.getEventFunnel(params.start, params.end);
    if (!params.downloadFormat && funnelStorage && !params.eventType) {
      this.eventFunnel$.next(funnelStorage);
      return;
    }

    this.queryRequest(eventsFunnelQuery(params.start, params.end), params.downloadFormat).subscribe(data => {
      if (params.downloadFormat) {
        downloadFile(data, 'events-by', params.downloadFormat);
        return;
      }

      if (data instanceof CustomServerError) {
        this.eventFunnel$.next(data);

        return;
      }

      let extracted = extractData(data).analytics.records;

      const funnel = new EventFunnel(extracted);

      this.eventFunnel$.next(funnel);
      this.analyticsStorage.setEventFunnel(params.start, params.end, funnel);
    });

    this.queryRequest(eventsFunnelTimeseriesQuery(params.start, params.end, params.period || "DAY", params.eventType)).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.eventFunnelTimeseries$.next(data);

        return;
      }

      let extracted = extractData(data).analytics.records;

      const timeseries = new EventFunnelTimeseries(extracted);

      this.eventFunnelTimeseries$.next(timeseries);
    })
  }

  getEventFunnelSimple(params: {start: string, end: string, downloadFormat?: string, eventType?: string, period?: string}): void {
    const funnelStorage = this.analyticsStorage.getEventFunnelSimple(params.start, params.end);
    if (!params.downloadFormat && funnelStorage && !params.eventType) {
      this.eventFunnelSimple$.next(funnelStorage);
      return;
    }

    this.queryRequest(eventsFunnelQuery(params.start, params.end), params.downloadFormat).subscribe(data => {
      if (params.downloadFormat) {
          downloadFile(data, 'events-by', params.downloadFormat);
          return;
        }

        if (data instanceof CustomServerError) {
          this.eventFunnelSimple$.next(data);
          return;
        }

        let extracted = extractData(data).analytics.records;

        const funnel = new EventFunnel(extracted);

        this.eventFunnelSimple$.next(funnel);
      this.analyticsStorage.setEventFunnelSimple(params.start, params.end, funnel);
    });

    this.queryRequest(eventsFunnelTimeseriesQuery(params.start, params.end, params.period || "DAY", params.eventType)).subscribe(data => {
      if (data instanceof CustomServerError) {
          this.eventFunnelTimeseriesSimple$.next(data);
          return;
        }

        let extracted = extractData(data).analytics.records;

        const timeseries = new EventFunnelTimeseries(extracted);

        this.eventFunnelTimeseriesSimple$.next(timeseries);
    })
  }

  getSubscriptionsByAmount(params: {start: string, end: string, downloadFormat?: string}): void {
    const subsStorage = this.analyticsStorage.getSubscriptionsByAmount(params.start, params.end);

    if (!params.downloadFormat && subsStorage) {
      this.subscriptionsByAmount$.next(subsStorage);
      return;
    }

    this.queryRequest(productSchedulesByAmountQuery(params.start, params.end), params.downloadFormat).subscribe(data => {
      if (params.downloadFormat) {
        downloadFile(data, 'subscriptions-by-amount', params.downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.subscriptionsByAmount$,
        (t: any) => new SubscriptionStats(t),
        (data: any) => extractData(data).analytics.records
      );
      if (result) {
        this.analyticsStorage.setSubscriptionsByAmount(params.start, params.end, result);
      }
    })
  }

  getCampaignsByAmount(params: {start: string, end: string, downloadFormat?: string}): void {
    const campaignsStorage = this.analyticsStorage.getCampaignsByAmount(params.start, params.end);
    if (!params.downloadFormat && campaignsStorage) {
      this.campaignsByAmount$.next(campaignsStorage);
      return;
    }

    this.queryRequest(campaignsByAmountQuery(params.start, params.end), params.downloadFormat).subscribe(data => {
      if (params.downloadFormat) {
        downloadFile(data, 'campaigns-by-amount', params.downloadFormat);
        return;
      }

      const result = this.handleResponse(
        data,
        this.campaignsByAmount$,
        (t: any) => new CampaignStats(t),
        (data: any) => extractData(data).analytics.records
      );
      if (result) {
        this.analyticsStorage.setCampaignsByAmount(params.start, params.end, result);
      }
    })
  }

  getAffiliates(params: {
    reportName?: string,
    start: string,
    end: string,
    limit?: number,
    offset?: number,
    orderBy?: string,
    sort?: string,
    facets?: {facet: string, values: string[]}[]
  }): Observable<AffiliateAnalytics[] | CustomServerError> {
    params.reportName = 'affiliateTraffic';

    return this.queryRequest(analyticsDetailQuery(params))
      .map(data => {
        if (data instanceof CustomServerError) return data;

        const entities = extractData(data).analytics.records;

        if (!entities) return null;

        return entities.map(entity => new AffiliateAnalytics(entity));
      })
  }

  getMerchants(params: {
    reportName?: string,
    start: string,
    end: string,
    limit?: number,
    offset?: number,
    orderBy?: string,
    sort?: string,
    facets?: {facet: string, values: string[]}[]
  }): Observable<MerchantAnalytics[] | CustomServerError> {
    params.reportName = 'merchantReport';

    return this.queryRequest(analyticsDetailQuery(params))
      .map(data => {
        if (data instanceof CustomServerError) return data;

        const entities = extractData(data).analytics.records;

        if (!entities) return null;

        return entities.map(entity => new MerchantAnalytics(entity));
      })
  }

  getTransactions(params: {
    reportName?: string,
    start: string,
    end: string,
    limit?: number,
    offset?: number,
    orderBy?: string,
    sort?: string,
    facets?: {facet: string, values: string[]}[]
  }): Observable<TransactionAnalytics[] | CustomServerError> {
    params.reportName = 'transactionDetail';

    return this.queryRequest(analyticsDetailQuery(params))
      .map(data => {
        if (data instanceof CustomServerError) return data;

        const entities = extractData(data).analytics.records;

        if (!entities) return null;

        return entities.map(entity => new TransactionAnalytics(entity));
      })
  }

  getOrders(params: {
    reportName?: string,
    start: string,
    end: string,
    limit?: number,
    offset?: number,
    orderBy?: string,
    sort?: string,
    facets?: {facet: string, values: string[]}[]
  }): Observable<OrderAnalytics[] | CustomServerError> {
    params.reportName = 'rebillDetail';

    return this.queryRequest(analyticsDetailQuery(params))
      .map(data => {
        if (data instanceof CustomServerError) return data;

        const entities = extractData(data).analytics.records;

        if (!entities) return null;

        return entities.map(entity => new OrderAnalytics(entity));
      })
  }

  getCustomers(params: {
    reportName?: string,
    start: string,
    end: string,
    limit?: number,
    offset?: number,
    orderBy?: string,
    sort?: string,
    facets?: {facet: string, values: string[]}[]
  }): Observable<CustomerAnalytics[] | CustomServerError> {
    params.reportName = 'customerDetail';

    return this.queryRequest(analyticsDetailQuery(params))
      .map(data => {
        if (data instanceof CustomServerError) return data;

        const entities = extractData(data).analytics.records;

        if (!entities) return null;

        return entities.map(entity => new CustomerAnalytics(entity));
      })
  }

  getActivityByCustomer(params: {start: string, end: string, customer: string, limit: number, offset: number}) {
    this.queryRequest(activitiesByCustomer(params.start, params.end, params.customer, params.limit, params.offset)).subscribe(data => {
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
    this.eventFunnelTimeseries$.next(null);
    this.eventFunnelSimple$.next(null);
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
