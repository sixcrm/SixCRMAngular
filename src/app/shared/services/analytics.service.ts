import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {EventFunnel} from '../models/event-funnel.model';
import {Headers, Response, Http} from '@angular/http';
import {TransactionOverview} from '../models/transaction-overview.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {
  transactionSummaryQuery, transactionOverviewQuery, eventsFunelQuery,
  campaignDeltaQuery, eventsByAffiliateQuery, eventsSummaryQuery, transactionsByAffiliateQuery, campaignsByAmountQuery,
  activitiesByCustomer
} from '../utils/queries/analytics.queries';
import {CampaignDelta} from '../models/campaign-delta.model';
import {EventSummary} from '../models/event-summary.model';
import {CampaignStats} from '../models/campaign-stats.model';
import {AnalyticsStorageService} from './analytics-storage.service';
import {TransactionsBy} from '../models/analytics/transaction-by.model';
import {EventsBy} from '../models/analytics/events-by.model';
import {FilterTerm} from '../components/advanced-filter/advanced-filter.component';
import {downloadJSON} from '../utils/file-utils';
import {Activity} from '../models/analytics/activity.model';

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

  activitiesByCustomer$: Subject<Activity[]>;

  constructor(private authService: AuthenticationService, private analyticsStorage: AnalyticsStorageService, private http: Http) {
    this.eventFunnel$ = new BehaviorSubject(null);
    this.transactionsSummaries$ = new BehaviorSubject(null);
    this.transactionsOverview$ = new BehaviorSubject(null);
    this.campaignDelta$ = new BehaviorSubject(null);
    this.eventsBy$ = new BehaviorSubject(null);
    this.eventsSummary$ = new BehaviorSubject(null);
    this.transactionsBy$ = new BehaviorSubject(null);
    this.campaignsByAmount$ = new BehaviorSubject(null);

    this.activitiesByCustomer$ = new Subject();
  }

  getTransactionSummaries(start: string, end: string, filters: FilterTerm[], download?: boolean): void {
    let summariesStorage = this.analyticsStorage.getTransactionSummaries(start, end, filters);

    if (!download && summariesStorage) {
      this.transactionsSummaries$.next(summariesStorage);
    } else {
      this.queryRequest(transactionSummaryQuery(start, end, filters), download).subscribe(
        (data) => {
          if (!download) {
            let transactions = data.json().data.transactionsummary.transactions;

            if (transactions) {
              let s = transactions.map(t => new TransactionSummary(t));
              this.transactionsSummaries$.next(s);
              this.analyticsStorage.setTransactionSummaries(start, end, s, filters);
            }
          } else {
            downloadJSON(data.json(), 'transactions-summary.json');
          }

        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  getTransactionOverview(start: string, end: string, download?: boolean): void {
    let overviewStorage = this.analyticsStorage.getTransactionOverview(start, end);

    if (!download && overviewStorage) {
      this.transactionsOverview$.next(overviewStorage);
    } else {
      this.queryRequest(transactionOverviewQuery(start, end), download).subscribe(
        (data) => {
          if (!download) {
            let overview = data.json().data.transactionoverview.overview;

            if (overview) {
              let o = new TransactionOverview(overview);
              this.transactionsOverview$.next(new TransactionOverview(overview));
              this.analyticsStorage.setTransactionOverview(start, end, o);
            }
          } else {
            downloadJSON(data.json(), 'transactions-overview.json');
          }
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  getEventFunnel(start: string, end: string, download?: boolean): void {
    let funnelStorage = this.analyticsStorage.getEventFunnel(start, end);

    if (!download && funnelStorage) {
      this.eventFunnel$.next(funnelStorage);
    } else {
      this.queryRequest(eventsFunelQuery(start, end), download).subscribe((data) => {
        if (!download) {
          let funnel = data.json().data.eventfunnel.funnel;

          if (funnel) {
            let f = new EventFunnel(funnel);
            this.eventFunnel$.next(f);
            this.analyticsStorage.setEventFunnel(start, end, f);
          }
        } else {
          downloadJSON(data.json(), 'events-by.json');
        }
      })
    }
  }

  getCampaignDelta(start: string, end: string, download?: boolean): void {
    let deltaStorage = this.analyticsStorage.getCampaignsDelta(start, end);

    if (!download && deltaStorage) {
      this.campaignDelta$.next(deltaStorage);
    } else {
      this.queryRequest(campaignDeltaQuery(start, end), download).subscribe(data => {
        if (!download) {
          let campaigns = data.json().data.campaigndelta.campaigns;

          if (campaigns) {
            let c = campaigns.map(d => new CampaignDelta(d));
            this.campaignDelta$.next(c);
            this.analyticsStorage.setCampaignsDelta(start, end, c);
          }
        } else {
          downloadJSON(data.json(), 'campaigns-delta.json');
        }
      })
    }
  }

  getEventsBy(start: string, end: string, download?: boolean): void {
    let eventsStorage = this.analyticsStorage.getEventsBy(start, end);

    if (!download && eventsStorage) {
      this.eventsBy$.next(eventsStorage);
    } else {
      this.queryRequest(eventsByAffiliateQuery(start, end), download).subscribe(data => {
        if (!download) {
          let events = data.json().data.eventsbyfacet;

          if (events) {
            let e = new EventsBy(events);
            this.eventsBy$.next(e);
            this.analyticsStorage.setEventsBy(start, end, e);
          }
        } else {
          downloadJSON(data.json(), 'events-by-affiliate.json');
        }
      });
    }
  }

  getTransactionsBy(start: string, end: string, download?: boolean): void {
    let transactionsBy = this.analyticsStorage.getTransactionsBy(start, end);

    if (!download && transactionsBy) {
      this.transactionsBy$.next(transactionsBy);
    } else {
      this.queryRequest(transactionsByAffiliateQuery(start, end), download).subscribe(data => {
        if (!download) {
          let events = data.json().data.transactionsbyfacet;

          if (events) {
            let e = new TransactionsBy(events);
            this.transactionsBy$.next(e);
            this.analyticsStorage.setTransactionsBy(start, end, e);
          }
        } else {
          downloadJSON(data.json(), 'transactions-by-affiliate.json');
        }
      });
    }
  }

  getEventsSummary(start: string, end: string, download?: boolean): void {
    let summaryStorage = this.analyticsStorage.getEventSummary(start, end);

    if (!download && summaryStorage) {
      this.eventsSummary$.next(summaryStorage);
    } else {
      this.queryRequest(eventsSummaryQuery(start, end), download).subscribe(data => {
        if (!download) {
          let events = data.json().data.eventsummary.events;

          if (events) {
            let e = events.map(e => new EventSummary(e));
            this.eventsSummary$.next(e);
            this.analyticsStorage.setEventSummary(start, end, e);
          }
        } else {
          downloadJSON(data.json(), 'events-summary.json');
        }
      })
    }
  }

  getCampaignsByAmount(start: string, end: string, download?: boolean): void {
    let campaignsStorage = this.analyticsStorage.getCampaignsByAmount(start, end);

    if (!download && campaignsStorage) {
      this.campaignsByAmount$.next(campaignsStorage);
    } else {
      this.queryRequest(campaignsByAmountQuery(start, end), download).subscribe(data => {
        if (!download) {
          let campaigns = data.json().data.campaignsbyamount.campaigns;

          if (campaigns) {
            let c = campaigns.map(c => new CampaignStats(c));
            this.campaignsByAmount$.next(c);
            this.analyticsStorage.setCampaignsByAmount(start, end, c);
          }
        } else {
          downloadJSON(data.json(), 'campaigns-by-amount.json');
        }
      })
    }
  }

  getActivityByCustomer(start: string, end: string, customer: string, limit: number, offset: number) {
    this.queryRequest(activitiesByCustomer(start, end, customer, limit, offset)).subscribe(data => {
      let activityList = data.json().data.listactivitybycustomer;

      if (activityList && activityList.activity) {
        this.activitiesByCustomer$.next(activityList.activity.map(activity => new Activity(activity)));
      }
    })
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

  private queryRequest(query: string, download?: boolean): Observable<Response> {
    let endpoint = environment.endpoint;

    if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    if (download) {
      endpoint += '?download=json';
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
