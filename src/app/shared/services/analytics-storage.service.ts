import { Injectable } from '@angular/core';
import {EventFunnel} from '../models/event-funnel.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {TransactionOverview} from '../models/transaction-overview.model';
import {EventSummary} from '../models/event-summary.model';
import {CampaignDelta} from '../models/campaign-delta.model';
import {CampaignStats} from '../models/campaign-stats.model';
import {FilterTerm} from '../../pages/dashboard-page/dashboard.component';
import {Moment, utc} from 'moment';
import {TransactionBy} from '../models/analytics/transaction-by.model';
import {AffiliateEvents} from '../models/affiliate-events.model';

export class AnalyticsStateEntry<T> {
  startDate: string;
  endDate: string;
  entry: T;
  filters: FilterTerm[] = [];
  private createdAt: Moment;

  constructor(startDate: string, endDate: string, entry: T) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.entry = entry;
    this.createdAt = utc();
  }

  setFilters(filters: FilterTerm[]): AnalyticsStateEntry<T> {
    if (filters) {
      this.filters = filters.slice();
    }

    return this;
  }

  isExpired(): boolean {
    return this.createdAt.isSameOrBefore(utc().subtract(30, 'minutes'));
  }

  matchFilters(filters: FilterTerm[]): boolean {
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
  private lastUpdated: string = 'last_updated';

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

  refresh(): void {
    this.storage = {};
  }

  getStartDate(): string {
    return this.storage[this.startKey];
  }

  getEndDate(): string {
    return this.storage[this.endKey];
  }

  getFilters(): FilterTerm[] {
    return this.storage[this.filters];
  }

  getLastUpdatedTime(): Moment {
    return utc(this.storage[this.lastUpdated]);
  }

  getEventFunnel(start: string, end: string): EventFunnel {
    let funnelEntry: AnalyticsStateEntry<EventFunnel> = this.storage[this.eventFunnelKey];

    if (this.isInvalid(funnelEntry, start, end)) return null;

    return funnelEntry.entry
  }

  setEventFunnel(start: string, end: string, funnel: EventFunnel): void {
    this.saveStartEnd(start, end);

    this.storage[this.eventFunnelKey] = new AnalyticsStateEntry(start, end, funnel)
  }

  getEventsByAffiliate(start: string, end: string): AffiliateEvents {
    let eventsEntry: AnalyticsStateEntry<AffiliateEvents> = this.storage[this.eventsByAffiliateKey];

    if (this.isInvalid(eventsEntry, start, end)) return null;

    return eventsEntry.entry
  }

  setEventsByAffiliate(start: string, end: string, events: AffiliateEvents): void {
    this.saveStartEnd(start, end);

    this.storage[this.eventsByAffiliateKey] = new AnalyticsStateEntry(start, end, events);
  }

  getTransactionsByAffiliate(start: string, end: string): TransactionBy {
    let eventsEntry: AnalyticsStateEntry<TransactionBy> = this.storage[this.transactionsByAffiliateKey];

    if (this.isInvalid(eventsEntry, start, end)) return null;

    return eventsEntry.entry
  }

  setTransactionsByAffiliate(start: string, end: string, events: TransactionBy): void {
    this.saveStartEnd(start, end);

    this.storage[this.transactionsByAffiliateKey] = new AnalyticsStateEntry(start, end, events);
  }

  getTransactionSummaries(start: string, end: string, filters?: FilterTerm[]): TransactionSummary[] {
    let summariesEntry: AnalyticsStateEntry<TransactionSummary[]> = this.storage[this.transactionSummariesKey];

    if (this.isInvalid(summariesEntry, start, end)) return null;

    if (!summariesEntry.matchFilters(filters)) return null;

    return summariesEntry.entry
  }

  setTransactionSummaries(start: string, end: string, summaries: TransactionSummary[], filters?: FilterTerm[]): void {
    this.saveStartEnd(start, end);
    this.saveFilters(filters);

    this.storage[this.transactionSummariesKey] = new AnalyticsStateEntry(start, end, summaries).setFilters(filters);
  }

  getTransactionOverview(start: string, end: string): TransactionOverview {
    let overviewEntry: AnalyticsStateEntry<TransactionOverview> = this.storage[this.transactionOverviewKey];

    if (this.isInvalid(overviewEntry, start, end)) return null;

    return overviewEntry.entry
  }

  setTransactionOverview(start: string, end: string, overview: TransactionOverview): void {
    this.saveStartEnd(start, end);

    this.storage[this.transactionOverviewKey] = new AnalyticsStateEntry(start, end, overview);
  }

  getEventSummary(start: string, end: string): EventSummary[] {
    let summaryEntry: AnalyticsStateEntry<EventSummary[]> = this.storage[this.eventSummaryKey];

    if (this.isInvalid(summaryEntry, start, end)) return null;

    return summaryEntry.entry
  }

  setEventSummary(start: string, end: string, summary: EventSummary[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.eventSummaryKey] = new AnalyticsStateEntry(start, end, summary);
  }

  getCampaignsDelta(start: string, end: string): CampaignDelta[] {
    let deltaEntry: AnalyticsStateEntry<CampaignDelta[]> = this.storage[this.campaignsDeltaKey];

    if (this.isInvalid(deltaEntry, start, end)) return null;

    return deltaEntry.entry
  }

  setCampaignsDelta(start: string, end: string, delta: CampaignDelta[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.campaignsDeltaKey] = new AnalyticsStateEntry(start, end, delta);
  }

  getCampaignsByAmount(start: string, end: string): CampaignStats[] {
    let campaignEntry: AnalyticsStateEntry<CampaignStats[]> = this.storage[this.campaignsByAmountKey];

    if (this.isInvalid(campaignEntry, start, end)) return null;

    return campaignEntry.entry
  }

  setCampaignsByAmount(start: string, end: string, campaigns: CampaignStats[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.campaignsByAmountKey] = new AnalyticsStateEntry(start, end, campaigns);
  }

  private isInvalid(entry: any, start: string, end: string): boolean {
    return !entry || entry.startDate !== start || entry.endDate !== end || entry.isExpired();
  }

  private saveStartEnd(start: string, end: string): void {
    this.storage[this.startKey] = start;
    this.storage[this.endKey] = end;
    this.storage[this.lastUpdated] = utc();
  }

  private saveFilters(filters: FilterTerm[]): void {
    this.storage[this.filters] = filters.slice();
  }
}
