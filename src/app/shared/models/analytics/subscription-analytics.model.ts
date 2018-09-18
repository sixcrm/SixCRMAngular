import {Moment, utc} from 'moment'
import {Currency} from '../../utils/currency/currency';

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

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.obj = obj;

    this.id = obj.id || '';
    this.alias = obj.alias || '';
    this.status = obj.status || '';
    this.cycle = obj.cycle || 0;
    this.interval = obj.interval || '';
    this.date = utc(obj.date);
    this.amount = new Currency(obj.amount);
    this.items = obj.items || 0;
    this.campaignId = obj.campaign || '';
    this.campaignName = obj.campaign_name || '';
    this.customerId = obj.customer || '';
    this.customerName = obj.customer_name || '';
  }
}
