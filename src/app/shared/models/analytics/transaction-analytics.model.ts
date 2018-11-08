import { Moment, utc} from 'moment';
import {Currency} from '../../utils/currency/currency';
import {getValueOf} from './analytics-model.utilities';

export class TransactionAnalytics {

  id: string;
  date: Moment;
  transactionType: string;
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
  merchantCode: string;
  merchantMessage: string;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.id = getValueOf(obj, 'id');
    this.date = utc(getValueOf(obj, 'datetime'));
    this.transactionType = getValueOf(obj, 'transaction_type');
    this.response = getValueOf(obj, 'response') || '';
    this.amount = this.transactionType === 'refund'
      ? new Currency(getValueOf(obj, 'associated_transaction_amount') || 0)
      : new Currency(getValueOf(obj, 'amount') || 0);
    this.refund = new Currency(getValueOf(obj, 'refund') || 0);
    this.merchantProvider = getValueOf(obj, 'merchant_provider_name') || '';
    this.merchantProviderId = getValueOf(obj, 'merchant_provider') || '';
    this.alias = getValueOf(obj, 'alias') || '';
    this.rebillAlias = getValueOf(obj, 'rebill_alias') || '';
    this.rebillId = getValueOf(obj, 'rebill') || '';
    this.sessionAlias = getValueOf(obj, 'session_alias') || '';
    this.sessionId= getValueOf(obj, 'session') || '';
    this.creditCard = getValueOf(obj, 'creditcard') || '';
    this.customer = getValueOf(obj, 'customer_name') || '';
    this.customerId = getValueOf(obj, 'customer');
    this.merchantCode = getValueOf(obj, 'merchant_code');
    this.merchantMessage = getValueOf(obj, 'merchant_message');
  }

}