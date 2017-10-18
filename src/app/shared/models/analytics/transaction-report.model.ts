import {Moment, utc} from 'moment'
import {Currency} from '../../utils/currency/currency';
import {Customer} from '../customer.model';
import {MerchantProvider} from '../merchant-provider/merchant-provider.model';
import {Campaign} from '../campaign.model';
import {Affiliate} from '../affiliate.model';

export class TransactionReport {
  id: string;
  date: Moment;
  customer: Customer;
  merchantProvider: MerchantProvider;
  campaign: Campaign;
  affiliate: Affiliate;
  amount: Currency;
  processorResult: string;
  transactionType: string;
  cycle: string;
  recycle: string;
  gatewayReponse: string;
  transactionIdGateway: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.date = utc(obj.date);
    this.customer = new Customer(obj.customer);
    this.merchantProvider = new MerchantProvider(obj.merchant_provider);
    this.campaign = new Campaign(obj.campaign);
    this.affiliate = new Affiliate(obj.affiliate);
    this.amount = new Currency(obj.amount);
    this.processorResult = obj.processor_result || '';
    this.transactionType = obj.transaction_type || '';
    this.cycle = obj.cycle || '';
    this.recycle = obj.recycle || '';
    this.gatewayReponse = obj.gatewayReponse || '';
    this.transactionIdGateway = obj.transaction_id_gateway || '';
  }
}
