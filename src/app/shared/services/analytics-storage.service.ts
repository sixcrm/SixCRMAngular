import { Injectable } from '@angular/core';
import {EventFunnel} from '../models/event-funnel.model';
import {AffiliateEvents} from '../models/affiliate-events.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {TransactionOverview} from '../models/transaction-overview.model';
import {EventSummary} from '../models/event-summary.model';
import {utc} from 'moment';
import {CampaignDelta} from '../models/campaign-delta.model';
import {CampaignStats} from '../models/campaign-stats.model';

export class AnalyticsStateEntry<T> {
  startDate: string;
  endDate: string;
  entry: T;

  constructor(startDate: string, endDate: string, entry: T) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.entry = entry;
  }
}

@Injectable()
export class AnalyticsStorageService {

  private startKey: string = 'start_filter';
  private endKey: string = 'end_filter';
  private filterTermsKey: string = 'terms_filter';

  private eventFunnelKey: string = 'event_funnel';
  private eventsByAffiliateKey: string = 'events_by_affiliate';
  private transactionsByAffiliateKey: string = 'transactions_by_affiliate';
  private transactionSummariesKey: string = 'transaction_summaries';
  private transactionOverviewKey: string = 'transaction_overview';
  private eventSummaryKey: string = 'event_summary';
  private campaignsDeltaKey: string = 'campaigns_delta';
  private campaignsByAmountKey: string = 'campaign_by_amount';

  constructor() {}

  getStartDate(): string {
    return localStorage.getItem(this.startKey);
  }

  getEndDate(): string {
    return localStorage.getItem(this.endKey);
  }

  getFilterTerms(): any[] {
    return [];
  }

  getEventFunnel(start: string, end: string): EventFunnel {
    let funnelEntry: AnalyticsStateEntry<EventFunnel> = JSON.parse(localStorage.getItem(this.eventFunnelKey));

    if (!funnelEntry || funnelEntry.startDate !== start || funnelEntry.endDate !== end) return null;

    return funnelEntry.entry
  }

  setEventFunnel(start: string, end: string, funnel: EventFunnel): void {
    this.saveStartEnd(start, end);

    let funnelEntry: AnalyticsStateEntry<EventFunnel> = new AnalyticsStateEntry(start, end, funnel);
    localStorage.setItem(this.eventFunnelKey, JSON.stringify(funnelEntry));
  }

  getEventsByAffiliate(start: string, end: string): AffiliateEvents {
    let eventsEntry: AnalyticsStateEntry<AffiliateEvents> = JSON.parse(localStorage.getItem(this.eventsByAffiliateKey));

    if (!eventsEntry || eventsEntry.startDate !== start || eventsEntry.endDate !== end) return null;

    return eventsEntry.entry
  }

  setEventsByAffiliate(start: string, end: string, events: AffiliateEvents): void {
    this.saveStartEnd(start, end);

    let eventsEntry: AnalyticsStateEntry<AffiliateEvents> = new AnalyticsStateEntry(start, end, events);
    localStorage.setItem(this.eventsByAffiliateKey, JSON.stringify(eventsEntry));
  }

  getTransactionsByAffiliate(start: string, end: string): AffiliateEvents {
    let eventsEntry: AnalyticsStateEntry<AffiliateEvents> = JSON.parse(localStorage.getItem(this.transactionsByAffiliateKey));

    if (!eventsEntry || eventsEntry.startDate !== start || eventsEntry.endDate !== end) return null;

    return eventsEntry.entry
  }

  setTransactionsByAffiliate(start: string, end: string, events: AffiliateEvents): void {
    this.saveStartEnd(start, end);

    let eventsEntry: AnalyticsStateEntry<AffiliateEvents> = new AnalyticsStateEntry(start, end, events);
    localStorage.setItem(this.transactionsByAffiliateKey, JSON.stringify(eventsEntry));
  }

  getTransactionSummaries(start: string, end: string): TransactionSummary[] {
    let summariesEntry: AnalyticsStateEntry<TransactionSummary[]> = JSON.parse(localStorage.getItem(this.transactionSummariesKey));

    if (!summariesEntry || summariesEntry.startDate !== start || summariesEntry.endDate !== end) return null;

    return summariesEntry.entry
  }

  setTransactionSummaries(start: string, end: string, summaries: TransactionSummary[]): void {
    this.saveStartEnd(start, end);

    let summariesEntry: AnalyticsStateEntry<TransactionSummary[]> = new AnalyticsStateEntry(start, end, summaries);
    localStorage.setItem(this.transactionSummariesKey, JSON.stringify(summariesEntry));
  }

  getTransactionOverview(start: string, end: string): TransactionOverview {
    let overviewEntry: AnalyticsStateEntry<TransactionOverview> = JSON.parse(localStorage.getItem(this.transactionOverviewKey));

    if (!overviewEntry || overviewEntry.startDate !== start || overviewEntry.endDate !== end) return null;

    return overviewEntry.entry
  }

  setTransactionOverview(start: string, end: string, overview: TransactionOverview): void {
    this.saveStartEnd(start, end);

    let overviewEntry: AnalyticsStateEntry<TransactionOverview> = new AnalyticsStateEntry(start, end, overview);
    localStorage.setItem(this.transactionOverviewKey, JSON.stringify(overviewEntry));
  }

  getEventSummary(start: string, end: string): EventSummary[] {
    let summaryEntry: AnalyticsStateEntry<EventSummary[]> = JSON.parse(localStorage.getItem(this.eventSummaryKey));
    summaryEntry.entry = summaryEntry.entry.map(summary => {
      summary.date = utc(summary.date);
      return summary;
    });

    if (!summaryEntry || summaryEntry.startDate !== start || summaryEntry.endDate !== end) return null;

    return summaryEntry.entry
  }

  setEventSummary(start: string, end: string, summary: EventSummary[]): void {
    this.saveStartEnd(start, end);

    let summaryEntry: AnalyticsStateEntry<EventSummary[]> = new AnalyticsStateEntry(start, end, summary);
    localStorage.setItem(this.eventSummaryKey, JSON.stringify(summaryEntry));
  }

  getCampaignsDelta(start: string, end: string): CampaignDelta[] {
    let deltaEntry: AnalyticsStateEntry<CampaignDelta[]> = JSON.parse(localStorage.getItem(this.campaignsDeltaKey));

    if (!deltaEntry || deltaEntry.startDate !== start || deltaEntry.endDate !== end) return null;

    return deltaEntry.entry
  }

  setCampaignsDelta(start: string, end: string, delta: CampaignDelta[]): void {
    this.saveStartEnd(start, end);

    let deltaEntry: AnalyticsStateEntry<CampaignDelta[]> = new AnalyticsStateEntry(start, end, delta);
    localStorage.setItem(this.campaignsDeltaKey, JSON.stringify(deltaEntry));
  }

  getCampaignsByAmount(start: string, end: string): CampaignStats[] {
    let campaignEntry: AnalyticsStateEntry<CampaignStats[]> = JSON.parse(localStorage.getItem(this.campaignsByAmountKey));

    if (!campaignEntry || campaignEntry.startDate !== start || campaignEntry.endDate !== end) return null;

    return campaignEntry.entry
  }

  setCampaignsByAmount(start: string, end: string, campaigns: CampaignStats[]): void {
    this.saveStartEnd(start, end);

    let campaignEntry: AnalyticsStateEntry<CampaignStats[]> = new AnalyticsStateEntry(start, end, campaigns);
    localStorage.setItem(this.campaignsByAmountKey, JSON.stringify(campaignEntry));
  }

  private saveStartEnd(start: string, end: string): void {
    localStorage.setItem(this.startKey, start);
    localStorage.setItem(this.endKey, end);
  }
}
