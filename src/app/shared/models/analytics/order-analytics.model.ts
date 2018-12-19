import {Moment, utc} from 'moment';
import {Currency} from '../../utils/currency/currency';
import {getValueOf} from './analytics-model.utilities';

export class OrderAnalytics {

  id: string;
  alias: string;
  status: string;
  date: Moment;
  amount: Currency;
  items: number;
  campaign: string;
  campaignName: string;
  type: string;
  customer: string;
  customerName: string;
  returns: number;
  refunds: Currency;
  total: Currency;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.id = getValueOf(obj, 'id');
    this.alias = getValueOf(obj, 'alias');
    this.status = getValueOf(obj, 'status');
    this.date = utc(getValueOf(obj, 'datetime'));
    this.type = getValueOf(obj, 'type');
    this.amount = new Currency(getValueOf(obj, 'amount') || 0);
    this.returns = +getValueOf(obj, 'returns');
    this.refunds = new Currency(getValueOf(obj, 'refunds') || 0);
    this.total = new Currency(getValueOf(obj, 'total') || 0);
    this.items = +getValueOf(obj, 'items');
    this.customer = getValueOf(obj, 'customer');
    this.customerName = getValueOf(obj, 'customer_name');
    this.campaign = getValueOf(obj, 'campaign');
    this.campaignName = getValueOf(obj, 'campaign_name')
  }

}