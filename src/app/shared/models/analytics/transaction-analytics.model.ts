import { Moment, utc} from 'moment';
import {Currency} from '../../utils/currency/currency';

export class TransactionAnalytics {

  date: Moment;
  chargeback: boolean;
  response: string;
  amount: Currency;
  refund: Currency;
  merchantProvider: string;
  alias: string;
  rebillAlias: string;
  sessionAlias: string;
  creditCard: string;
  customer: string;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.date = utc(this.getValueOf('datetime'));
    this.chargeback = this.getValueOf('chargeback') === 'yes';
    this.response = this.getValueOf('response') || '';
    this.amount = new Currency(this.getValueOf('amount') || 0);
    this.refund = new Currency(this.getValueOf('refund') || 0);
    this.merchantProvider = this.getValueOf('merchant_provider_name') || '';
    this.alias = this.getValueOf('alias') || '';
    this.rebillAlias = this.getValueOf('rebill_alias') || '';
    this.sessionAlias = this.getValueOf('session_alias') || '';
    this.creditCard = this.getValueOf('creditcard') || '';
    this.customer = this.getValueOf('customer_name') || '';
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