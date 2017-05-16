import { Injectable } from '@angular/core';
import {EventFunnel} from '../models/event-funnel.model';
import {AffiliateEvents} from '../models/affiliate-events.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {TransactionOverview} from '../models/transaction-overview.model';
import {EventSummary} from '../models/event-summary.model';
import {CampaignDelta} from '../models/campaign-delta.model';
import {CampaignStats} from '../models/campaign-stats.model';
import {FilterTerm} from '../../pages/dashboard-page/dashboard.component';

export class AnalyticsStateEntry<T> {
  startDate: string;
  endDate: string;
  entry: T;
  filters: FilterTerm[] = [];

  constructor(startDate: string, endDate: string, entry: T) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.entry = entry;
  }

  setFilters(filters: FilterTerm[]): AnalyticsStateEntry<T> {
    if (!filters) {
      this.filters = [];
    } else {
      this.filters = filters.slice();
    }

    return this;
  }

  match(filters: FilterTerm[]): boolean {
    if (!filters) {
      filters = [];
    }

    if (filters.length !== this.filters.length) return false;

    let first = this.filters.map(f => f.id).sort(this.comparator);
    let second = filters.map(f => f.id).sort(this.comparator);

    for (let i = 0 ; i < first.length ; i++) {
      if (first[i] !== second[i]) return false;
    }

    return true;
  }

  private comparator(f: string, s: string): number {
    if (f < s) return -1;
    if (f > s) return 1;
    return 0;
  }
}

@Injectable()
export class AnalyticsStorageService {

  private startKey: string = 'start_filter';
  private endKey: string = 'end_filter';
  private filters: string = 'additional_filters';

  private eventFunnelKey: string = 'event_funnel';
  private eventsByAffiliateKey: string = 'events_by_affiliate';
  private transactionsByAffiliateKey: string = 'transactions_by_affiliate';
  private transactionSummariesKey: string = 'transaction_summaries';
  private transactionOverviewKey: string = 'transaction_overview';
  private eventSummaryKey: string = 'event_summary';
  private campaignsDeltaKey: string = 'campaigns_delta';
  private campaignsByAmountKey: string = 'campaign_by_amount';

  private storage: any = {};

  constructor() {}

  getStartDate(): string {
    return this.storage[this.startKey];
  }

  getEndDate(): string {
    return this.storage[this.endKey];
  }

  getFilters(): FilterTerm[] {
    return this.storage[this.filters];
  }

  getEventFunnel(start: string, end: string): EventFunnel {
    let funnelEntry: AnalyticsStateEntry<EventFunnel> = this.storage[this.eventFunnelKey];

    if (!funnelEntry || funnelEntry.startDate !== start || funnelEntry.endDate !== end) return null;

    return funnelEntry.entry
  }

  setEventFunnel(start: string, end: string, funnel: EventFunnel): void {
    this.saveStartEnd(start, end);

    this.storage[this.eventFunnelKey] = new AnalyticsStateEntry(start, end, funnel)
  }

  getEventsByAffiliate(start: string, end: string): AffiliateEvents {
    let eventsEntry: AnalyticsStateEntry<AffiliateEvents> = this.storage[this.eventsByAffiliateKey];

    if (!eventsEntry || eventsEntry.startDate !== start || eventsEntry.endDate !== end) return null;

    return eventsEntry.entry
  }

  setEventsByAffiliate(start: string, end: string, events: AffiliateEvents): void {
    this.saveStartEnd(start, end);

    this.storage[this.eventsByAffiliateKey] = new AnalyticsStateEntry(start, end, events);
  }

  getTransactionsByAffiliate(start: string, end: string): AffiliateEvents {
    let eventsEntry: AnalyticsStateEntry<AffiliateEvents> = this.storage[this.transactionsByAffiliateKey];

    if (!eventsEntry || eventsEntry.startDate !== start || eventsEntry.endDate !== end) return null;

    return eventsEntry.entry
  }

  setTransactionsByAffiliate(start: string, end: string, events: AffiliateEvents): void {
    this.saveStartEnd(start, end);

    this.storage[this.transactionsByAffiliateKey] = new AnalyticsStateEntry(start, end, events);
  }

  getTransactionSummaries(start: string, end: string, filters?: FilterTerm[]): TransactionSummary[] {
    let summariesEntry: AnalyticsStateEntry<TransactionSummary[]> = this.storage[this.transactionSummariesKey];

    if (!summariesEntry || summariesEntry.startDate !== start || summariesEntry.endDate !== end) return null;

    if (!summariesEntry.match(filters)) return null;

    return summariesEntry.entry
  }

  setTransactionSummaries(start: string, end: string, summaries: TransactionSummary[], filters?: FilterTerm[]): void {
    this.saveStartEnd(start, end);
    this.saveFilters(filters);

    this.storage[this.transactionSummariesKey] = new AnalyticsStateEntry(start, end, summaries).setFilters(filters);
  }

  getTransactionOverview(start: string, end: string): TransactionOverview {
    let overviewEntry: AnalyticsStateEntry<TransactionOverview> = this.storage[this.transactionOverviewKey];

    if (!overviewEntry || overviewEntry.startDate !== start || overviewEntry.endDate !== end) return null;

    return overviewEntry.entry
  }

  setTransactionOverview(start: string, end: string, overview: TransactionOverview): void {
    this.saveStartEnd(start, end);

    this.storage[this.transactionOverviewKey] = new AnalyticsStateEntry(start, end, overview);
  }

  getEventSummary(start: string, end: string): EventSummary[] {
    let summaryEntry: AnalyticsStateEntry<EventSummary[]> = this.storage[this.eventSummaryKey];

    if (!summaryEntry || summaryEntry.startDate !== start || summaryEntry.endDate !== end) return null;

    return summaryEntry.entry
  }

  setEventSummary(start: string, end: string, summary: EventSummary[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.eventSummaryKey] = new AnalyticsStateEntry(start, end, summary);
  }

  getCampaignsDelta(start: string, end: string): CampaignDelta[] {
    let deltaEntry: AnalyticsStateEntry<CampaignDelta[]> = this.storage[this.campaignsDeltaKey];

    if (!deltaEntry || deltaEntry.startDate !== start || deltaEntry.endDate !== end) return null;

    return deltaEntry.entry
  }

  setCampaignsDelta(start: string, end: string, delta: CampaignDelta[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.campaignsDeltaKey] = new AnalyticsStateEntry(start, end, delta);
  }

  getCampaignsByAmount(start: string, end: string): CampaignStats[] {
    let campaignEntry: AnalyticsStateEntry<CampaignStats[]> = this.storage[this.campaignsByAmountKey];

    if (!campaignEntry || campaignEntry.startDate !== start || campaignEntry.endDate !== end) return null;

    return campaignEntry.entry
  }

  setCampaignsByAmount(start: string, end: string, campaigns: CampaignStats[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.campaignsByAmountKey] = new AnalyticsStateEntry(start, end, campaigns);
  }

  private saveStartEnd(start: string, end: string): void {
    this.storage[this.startKey] = start;
    this.storage[this.endKey] = end;
  }

  private saveFilters(filters: FilterTerm[]): void {
    this.storage[this.filters] = filters.slice();
  }
}
