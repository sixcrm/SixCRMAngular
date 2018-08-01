import { Moment, utc} from 'moment';
import {Currency} from '../../utils/currency/currency';

export class TransactionAnalytics {

  id: string;
  date: Moment;
  chargeback: boolean;
  response: string;
  amount: Currency;
  refund: Currency;
  merchantProvider: string;
  merchantProviderId: string;
  alias: string;
  rebillAlias: string;
  rebillId: string;
  sessionAlias: string;
  sessionId: string;
  creditCard: string;
  customer: string;
  customerId: string;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.id = this.getValueOf('id');
    this.date = utc(this.getValueOf('datetime'));
    this.chargeback = this.getValueOf('chargeback') === 'yes';
    this.response = this.getValueOf('response') || '';
    this.amount = new Currency(this.getValueOf('amount') || 0);
    this.refund = new Currency(this.getValueOf('refund') || 0);
    this.merchantProvider = this.getValueOf('merchant_provider_name') || '';
    this.merchantProviderId = this.getValueOf('merchant_provider') || '';
    this.alias = this.getValueOf('alias') || '';
    this.rebillAlias = this.getValueOf('rebill_alias') || '';
    this.rebillId = this.getValueOf('rebill') || '';
    this.sessionAlias = this.getValueOf('session_alias') || '';
    this.sessionId= this.getValueOf('session') || '';
    this.creditCard = this.getValueOf('creditcard') || '';
    this.customer = this.getValueOf('customer_name') || '';
    this.customerId = this.getValueOf('customer')
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