import { Injectable } from '@angular/core';
import {EventFunnel} from '../models/event-funnel.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {CampaignStats} from '../models/campaign-stats.model';
import {Moment, utc} from 'moment';
import {FilterTerm} from '../components/advanced-filter/advanced-filter.component';
import {SubscriptionStats} from '../models/subscription-stats.model';

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
  private transactionSummariesKey: string = 'transaction_summaries';
  private campaignsByAmountKey: string = 'campaign_by_amount';
  private subscriptionsByAmountKey: string = 'subscriptions_by_amount';

  private storage: any = {};

  constructor() {}

  refresh(): void {
    this.storage = {};
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

  getCampaignsByAmount(start: string, end: string): CampaignStats[] {
    let campaignEntry: AnalyticsStateEntry<CampaignStats[]> = this.storage[this.campaignsByAmountKey];

    if (this.isInvalid(campaignEntry, start, end)) return null;

    return campaignEntry.entry
  }

  setCampaignsByAmount(start: string, end: string, campaigns: CampaignStats[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.campaignsByAmountKey] = new AnalyticsStateEntry(start, end, campaigns);
  }

  getSubscriptionsByAmount(start: string, end: string): SubscriptionStats[] {
    let subEntry: AnalyticsStateEntry<SubscriptionStats[]> = this.storage[this.subscriptionsByAmountKey];

    if (this.isInvalid(subEntry, start, end)) return null;

    return subEntry.entry
  }

  setSubscriptionsByAmount(start: string, end: string, subs: SubscriptionStats[]): void {
    this.saveStartEnd(start, end);

    this.storage[this.subscriptionsByAmountKey] = new AnalyticsStateEntry(start, end, subs);
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
