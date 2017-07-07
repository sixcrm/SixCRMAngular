import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {EventFunnel} from '../models/event-funnel.model';
import {Response} from '@angular/http';
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
import {downloadFile} from '../utils/file.utils';
import {Activity} from '../models/analytics/activity.model';
import {HttpWrapperService, extractData, generateHeaders} from './http-wrapper.service';

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

  constructor(private authService: AuthenticationService, private analyticsStorage: AnalyticsStorageService, private http: HttpWrapperService) {
    this.eventFunnel$ = new BehaviorSubject(null);
    this.transactionsSummaries$ = new BehaviorSubject(null);
    this.transactionsOverview$ = new BehaviorSubject(null);
    this.campaignDelta$ = new BehaviorSubject(null);
    this.eventsBy$ = new BehaviorSubject(null);
    this.eventsSummary$ = new BehaviorSubject(null);
    this.transactionsBy$ = new BehaviorSubject(null);
    this.campaignsByAmount$ = new BehaviorSubject(null);

    this.activitiesByCustomer$ = new Subject();

    this.authService.activeAcl$.subscribe(() => {
      if (this.authService.active()) {
        this.clearAllSubjects();
        this.analyticsStorage.refresh();
      }
    });
  }

  getTransactionSummaries(start: string, end: string, filters: FilterTerm[], downloadFormat?: string): void {
    let summariesStorage = this.analyticsStorage.getTransactionSummaries(start, end, filters);

    if (!downloadFormat && summariesStorage) {
      this.transactionsSummaries$.next(summariesStorage);
    } else {
      this.queryRequest(transactionSummaryQuery(start, end, filters), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let transactions = extractData(data).transactionsummary.transactions;

          if (transactions) {
            let s = transactions.map(t => new TransactionSummary(t));
            this.transactionsSummaries$.next(s);
            this.analyticsStorage.setTransactionSummaries(start, end, s, filters);
          }
        } else {
          downloadFile(data, 'transactions-summary', downloadFormat);
        }
      })
    }
  }

  getTransactionOverview(start: string, end: string, downloadFormat?: string): void {
    let overviewStorage = this.analyticsStorage.getTransactionOverview(start, end);

    if (!downloadFormat && overviewStorage) {
      this.transactionsOverview$.next(overviewStorage);
    } else {
      this.queryRequest(transactionOverviewQuery(start, end), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let overview = extractData(data).transactionoverview.overview;

          if (overview) {
            let o = new TransactionOverview(overview);
            this.transactionsOverview$.next(new TransactionOverview(overview));
            this.analyticsStorage.setTransactionOverview(start, end, o);
          }
        } else {
          downloadFile(data, 'transactions-overview', downloadFormat);
        }
      })
    }
  }

  getEventFunnel(start: string, end: string, downloadFormat?: string): void {
    let funnelStorage = this.analyticsStorage.getEventFunnel(start, end);

    if (!downloadFormat && funnelStorage) {
      this.eventFunnel$.next(funnelStorage);
    } else {
      this.queryRequest(eventsFunelQuery(start, end), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let funnel = extractData(data).eventfunnel.funnel;

          if (funnel) {
            let f = new EventFunnel(funnel);
            this.eventFunnel$.next(f);
            this.analyticsStorage.setEventFunnel(start, end, f);
          }
        } else {
          downloadFile(data, 'events-by', downloadFormat);
        }
      })
    }
  }

  getCampaignDelta(start: string, end: string, downloadFormat?: string): void {
    let deltaStorage = this.analyticsStorage.getCampaignsDelta(start, end);

    if (!downloadFormat && deltaStorage) {
      this.campaignDelta$.next(deltaStorage);
    } else {
      this.queryRequest(campaignDeltaQuery(start, end), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let campaigns = extractData(data).campaigndelta.campaigns;

          if (campaigns) {
            let c = campaigns.map(d => new CampaignDelta(d));
            this.campaignDelta$.next(c);
            this.analyticsStorage.setCampaignsDelta(start, end, c);
          }
        } else {
          downloadFile(data, 'campaigns-delta', downloadFormat);
        }
      })
    }
  }

  getEventsBy(start: string, end: string, downloadFormat?: string): void {
    let eventsStorage = this.analyticsStorage.getEventsBy(start, end);

    if (!downloadFormat && eventsStorage) {
      this.eventsBy$.next(eventsStorage);
    } else {
      this.queryRequest(eventsByAffiliateQuery(start, end), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let events = extractData(data).eventsbyfacet;

          if (events) {
            let e = new EventsBy(events);
            this.eventsBy$.next(e);
            this.analyticsStorage.setEventsBy(start, end, e);
          }
        } else {
          downloadFile(data, 'events-by-affiliate', downloadFormat);
        }
      });
    }
  }

  getTransactionsBy(start: string, end: string, downloadFormat?: string): void {
    let transactionsBy = this.analyticsStorage.getTransactionsBy(start, end);

    if (!downloadFormat && transactionsBy) {
      this.transactionsBy$.next(transactionsBy);
    } else {
      this.queryRequest(transactionsByAffiliateQuery(start, end), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let events = extractData(data).transactionsbyfacet;

          if (events) {
            let e = new TransactionsBy(events);
            this.transactionsBy$.next(e);
            this.analyticsStorage.setTransactionsBy(start, end, e);
          }
        } else {
          downloadFile(data, 'transactions-by-affiliate', downloadFormat);
        }
      });
    }
  }

  getEventsSummary(start: string, end: string, downloadFormat?: string): void {
    let summaryStorage = this.analyticsStorage.getEventSummary(start, end);

    if (!downloadFormat && summaryStorage) {
      this.eventsSummary$.next(summaryStorage);
    } else {
      this.queryRequest(eventsSummaryQuery(start, end), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let events = extractData(data).eventsummary.events;

          if (events) {
            let e = events.map(e => new EventSummary(e));
            this.eventsSummary$.next(e);
            this.analyticsStorage.setEventSummary(start, end, e);
          }
        } else {
          downloadFile(data, 'events-summary', downloadFormat);
        }
      })
    }
  }

  getCampaignsByAmount(start: string, end: string, downloadFormat?: string): void {
    let campaignsStorage = this.analyticsStorage.getCampaignsByAmount(start, end);

    if (!downloadFormat && campaignsStorage) {
      this.campaignsByAmount$.next(campaignsStorage);
    } else {
      this.queryRequest(campaignsByAmountQuery(start, end), downloadFormat).subscribe(data => {
        if (!downloadFormat) {
          let campaigns = extractData(data).campaignsbyamount.campaigns;

          if (campaigns) {
            let c = campaigns.map(c => new CampaignStats(c));
            this.campaignsByAmount$.next(c);
            this.analyticsStorage.setCampaignsByAmount(start, end, c);
          }
        } else {
          downloadFile(data, 'campaigns-by-amount', downloadFormat);
        }
      })
    }
  }

  getActivityByCustomer(start: string, end: string, customer: string, limit: number, offset: number) {
    if (!this.hasPermission('getActivityByIdentifier')) return;

    this.queryRequest(activitiesByCustomer(start, end, customer, limit, offset)).subscribe(data => {
      let activityList = extractData(data).listactivitybyidentifier;

      if (activityList && activityList.activity) {
        this.activitiesByCustomer$.next(activityList.activity.map(activity => new Activity(activity)));
      } else {
        this.activitiesByCustomer$.next([]);
      }
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

  private queryRequest(query: string, downloadFormat?: string | boolean): Observable<Response> {
    let endpoint = environment.endpoint;

    if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    if (downloadFormat) {
      endpoint += '?download=' + downloadFormat;
    }

    return this.http.post(endpoint, query, { headers: generateHeaders(this.authService.getToken())});
  }
}
