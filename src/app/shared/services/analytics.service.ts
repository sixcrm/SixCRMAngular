import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {EventFunnel} from '../models/event-funnel.model';
import {Headers, Response, Http} from '@angular/http';
import {TransactionOverview} from '../models/transaction-overview.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {FilterTerm} from '../../pages/dashboard-page/dashboard.component';
import {
  transactionSummaryQuery, transactionOverviewQuery, eventsFunelQuery,
  campaignDeltaQuery, eventsByAffiliateQuery, eventsSummaryQuery, transactionsByAffiliateQuery, campaignsByAmountQuery
} from '../utils/queries/analytics.queries';
import {CampaignDelta} from '../models/campaign-delta.model';
import {EventSummary} from '../models/event-summary.model';
import {CampaignStats} from '../models/campaign-stats.model';
import {AnalyticsStorageService} from './analytics-storage.service';
import {TransactionsBy} from '../models/analytics/transaction-by.model';
import {EventsBy} from '../models/analytics/events-by.model';

@Injectable()
export class AnalyticsService {

  eventFunnel$: BehaviorSubject<EventFunnel>;
  transactionsSummaries$: BehaviorSubject<TransactionSummary[]>;
  transactionsOverview$: BehaviorSubject<TransactionOverview>;
  campaignDelta$: BehaviorSubject<CampaignDelta[]>;
  eventsBy$: BehaviorSubject<EventsBy>;
  transactionsBy$: BehaviorSubject<TransactionsBy>;
  eventsSummary$: BehaviorSubject<EventSummary[]>;
  campaignsByAmount$: BehaviorSubject<CampaignStats[]>;

  constructor(private authService: AuthenticationService, private analyticsStorage: AnalyticsStorageService, private http: Http) {
    this.eventFunnel$ = new BehaviorSubject(null);
    this.transactionsSummaries$ = new BehaviorSubject(null);
    this.transactionsOverview$ = new BehaviorSubject(null);
    this.campaignDelta$ = new BehaviorSubject(null);
    this.eventsBy$ = new BehaviorSubject(null);
    this.eventsSummary$ = new BehaviorSubject(null);
    this.transactionsBy$ = new BehaviorSubject(null);
    this.campaignsByAmount$ = new BehaviorSubject(null);
  }

  getTransactionSummaries(start: string, end: string, filters: FilterTerm[], additionalFilters?: any[]): void {
    let summariesStorage = this.analyticsStorage.getTransactionSummaries(start, end, filters);

    if (summariesStorage) {
      this.transactionsSummaries$.next(summariesStorage);
    } else {
      this.queryRequest(transactionSummaryQuery(start, end, filters, additionalFilters)).subscribe(
        (data) => {
          let transactions = data.json().data.transactionsummary.transactions;

          if (transactions) {
            let s = transactions.map(t => new TransactionSummary(t));
            this.transactionsSummaries$.next(s);
            this.analyticsStorage.setTransactionSummaries(start, end, s, filters);
          }
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  getTransactionOverview(start: string, end: string): void {
    let overviewStorage = this.analyticsStorage.getTransactionOverview(start, end);

    if (overviewStorage) {
      this.transactionsOverview$.next(overviewStorage);
    } else {
      this.queryRequest(transactionOverviewQuery(start, end)).subscribe(
        (data) => {
          let overview = data.json().data.transactionoverview.overview;

          if (overview) {
            let o = new TransactionOverview(overview);
            this.transactionsOverview$.next(new TransactionOverview(overview));
            this.analyticsStorage.setTransactionOverview(start, end, o);
          }
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  getEventFunnel(start: string, end: string): void {
    let funnelStorage = this.analyticsStorage.getEventFunnel(start, end);

    if (funnelStorage) {
      this.eventFunnel$.next(funnelStorage);
    } else {
      this.queryRequest(eventsFunelQuery(start, end)).subscribe((data) => {
        let funnel = data.json().data.eventfunnel.funnel;

        if (funnel) {
          let f = new EventFunnel(funnel);
          this.eventFunnel$.next(f);
          this.analyticsStorage.setEventFunnel(start, end, f);
        }
      })
    }
  }

  getCampaignDelta(start: string, end: string): void {
    let deltaStorage = this.analyticsStorage.getCampaignsDelta(start, end);

    if (deltaStorage) {
      this.campaignDelta$.next(deltaStorage);
    } else {
      this.queryRequest(campaignDeltaQuery(start, end)).subscribe(data => {
        let campaigns = data.json().data.campaigndelta.campaigns;

        if (campaigns) {
          let c = campaigns.map(d => new CampaignDelta(d));
          this.campaignDelta$.next(c);
          this.analyticsStorage.setCampaignsDelta(start, end, c);
        }
      })
    }
  }

  getEventsBy(start: string, end: string): void {
    let eventsStorage = this.analyticsStorage.getEventsBy(start, end);

    if (eventsStorage) {
      this.eventsBy$.next(eventsStorage);
    } else {
      this.queryRequest(eventsByAffiliateQuery(start, end)).subscribe(data => {
        let events = data.json().data.eventsbyfacet;

        if (events) {
          let e = new EventsBy(events);
          this.eventsBy$.next(e);
          this.analyticsStorage.setEventsBy(start, end, e);
        }
      });
    }
  }

  getTransactionsBy(start: string, end: string): void {
    let transactionsBy = this.analyticsStorage.getTransactionsBy(start, end);

    if (transactionsBy) {
      this.transactionsBy$.next(transactionsBy);
    } else {
      this.queryRequest(transactionsByAffiliateQuery(start, end)).subscribe(data => {
        let events = data.json().data.transactionsbyfacet;

        if (events) {
          let e = new TransactionsBy(events);
          this.transactionsBy$.next(e);
          this.analyticsStorage.setTransactionsBy(start, end, e);
        }
      });
    }
  }

  getEventsSummary(start: string, end: string): void {
    let summaryStorage = this.analyticsStorage.getEventSummary(start, end);

    if (summaryStorage) {
      this.eventsSummary$.next(summaryStorage);
    } else {
      this.queryRequest(eventsSummaryQuery(start, end)).subscribe(data => {
        let events = data.json().data.eventsummary.events;

        if (events) {
          let e = events.map(e => new EventSummary(e));
          this.eventsSummary$.next(e);
          this.analyticsStorage.setEventSummary(start, end, e);
        }
      })
    }
  }

  getCampaignsByAmount(start: string, end: string): void {
    let campaignsStorage = this.analyticsStorage.getCampaignsByAmount(start, end);

    if (campaignsStorage) {
      this.campaignsByAmount$.next(campaignsStorage);
    } else {
      this.queryRequest(campaignsByAmountQuery(start, end)).subscribe(data => {
        let campaigns = data.json().data.campaignsbyamount.campaigns;

        if (campaigns) {
          let c = campaigns.map(c => new CampaignStats(c));
          this.campaignsByAmount$.next(c);
          this.analyticsStorage.setCampaignsByAmount(start, end, c);
        }
      })
    }
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

  private queryRequest(query: string): Observable<Response> {
    let endpoint = environment.endpoint;


    if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint = endpoint + this.authService.getActiveAcl().account.id;
    } else {
      endpoint = endpoint + '*';
    }

    return this.http.post(endpoint, query, { headers: this.generateHeaders()});
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }
}
