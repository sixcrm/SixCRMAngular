import {Moment, utc} from 'moment'
import {Currency} from '../../utils/currency/currency';

export class TransactionReport {
  id: string;
  date: Moment;
  customer: string;
  creditCard: string;
  merchantProvider: string;
  campaign: string;
  affiliate: string;
  amount: Currency;
  processorResult: string;
  account: string;
  transactionType: string;
  productSchedule: string;
  subAffiliate1: string;
  subAffiliate2: string;
  subAffiliate3: string;
  subAffiliate4: string;
  subAffiliate5: string;
  transactionSubtype: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.date = utc(obj.date);
    this.customer = obj.customer || '';
    this.creditCard = obj.credit_card || '';
    this.merchantProvider = obj.merchant_provider || '';
    this.campaign = obj.campaign || '';
    this.affiliate = obj.affiliate || '';
    this.amount = new Currency(obj.amount);
    this.processorResult = obj.processor_result || '';
    this.account = obj.account || '';
    this.transactionType = obj.transaction_type || '';
    this.productSchedule = obj.product_schedule || '';
    this.subAffiliate1 = obj.subaffiliate_1 || '';
    this.subAffiliate2 = obj.subaffiliate_2 || '';
    this.subAffiliate3 = obj.subaffiliate_3 || '';
    this.subAffiliate4 = obj.subaffiliate_4 || '';
    this.subAffiliate5 = obj.subaffiliate_5 || '';
    this.transactionSubtype = obj.transaction_subtype || '';
  }
}
