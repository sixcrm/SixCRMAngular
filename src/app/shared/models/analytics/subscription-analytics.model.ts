import {Moment, utc} from 'moment'
import {Currency} from '../../utils/currency/currency';
import {getValueOf} from './analytics-model.utilities';

export class SubscriptionAnalytics {
  id: string;
  alias: string;
  status: string;
  cycle: number;
  interval: string;
  date: Moment;
  amount: Currency;
  items: number;
  campaignId: string;
  campaignName: string;
  customerId: string;
  customerName: string;
  sessionId: string;
  sessionAlias: string;
  productScheduleId: string;
  productScheduleName: string;
  merchantProviderId: string;
  merchantProviderName: string;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    this.obj = obj;

    this.id = getValueOf(obj, 'id');
    this.alias = getValueOf(obj, 'alias');
    this.status = getValueOf(obj, 'status');
    this.cycle = +(getValueOf(obj, 'cycle') || 0);
    this.interval = getValueOf(obj, 'interval');
    this.date = utc(getValueOf(obj, 'datetime'));
    this.amount = new Currency(getValueOf(obj, 'amount') || 0);
    this.items = +(getValueOf(obj, 'items') || 0);
    this.campaignId = getValueOf(obj, 'campaign');
    this.campaignName = getValueOf(obj, 'campaign_name');
    this.customerId = getValueOf(obj, 'customer');
    this.customerName = getValueOf(obj, 'customer_name');
    this.sessionAlias = getValueOf(obj, 'session_alias');
    this.sessionId = getValueOf(obj, 'session');
    this.productScheduleId = getValueOf(obj, 'product_schedule');
    this.productScheduleName = getValueOf(obj, 'product_schedule_name');
    this.merchantProviderId = getValueOf(obj, 'merchant_provider');
    this.merchantProviderName = getValueOf(obj, 'merchant_provider_name');
  }
}
