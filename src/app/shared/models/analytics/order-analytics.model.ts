import {Moment, utc} from 'moment';
import {Currency} from '../../utils/currency/currency';

export class OrderAnalytics {

  id: string;
  alias: string;
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
  chargebacks: Currency;
  total: Currency;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.id = this.getValueOf('id');
    this.alias = this.getValueOf('alias');
    this.date = utc(this.getValueOf('datetime'));
    this.type = this.getValueOf('type');
    this.amount = new Currency(this.getValueOf('amount') || 0);
    this.returns = +this.getValueOf('returns');
    this.refunds = new Currency(this.getValueOf('refunds') || 0);
    this.chargebacks = new Currency(this.getValueOf('chargebacks') || 0);
    this.total = new Currency(this.getValueOf('total') || 0);
    this.items = +this.getValueOf('items');
    this.customer = this.getValueOf('customer');
    this.customerName = this.getValueOf('customer_name');
    this.campaign = this.getValueOf('campaign');
    this.campaignName = this.getValueOf('campaign_name')
  }

  private getValueOf(key): any {
    for (let i = 0; i < this.obj.length; i++) {
      if (this.obj[i].key === key) {
        return this.obj[i].value;
      }
    }

    return '';
  }

}