import {Rebill} from './rebill.model';
import {ProcessorResponse} from './processor-response.model';
import {Entity} from './entity.interface';
import {Products} from './products.model';
import {Moment, utc} from 'moment';
import {MerchantProvider} from './merchant-provider/merchant-provider.model';
import {Currency} from '../utils/currency/currency';
import {CreditCard} from './credit-card.model';

export class Transaction implements Entity<Transaction>{
  id: string;
  alias: string;
  amount: Currency;
  merchantProvider: MerchantProvider;
  creditCard: CreditCard;
  createdAt: Moment;
  updatedAt: Moment;
  processorResponse: ProcessorResponse;
  rebill: Rebill;
  products: Products[];
  chargeback: boolean;
  type: string;
  result: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.alias = obj.alias || '';
    this.amount = new Currency(obj.amount);
    this.merchantProvider = new MerchantProvider(obj.merchant_provider);
    this.creditCard = new CreditCard(obj.creditcard);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.processorResponse = new ProcessorResponse(obj.processor_response);
    this.rebill = new Rebill(obj.rebill);
    this.chargeback = !!obj.chargeback;
    this.products = [];
    this.type = obj.type || 'sale';
    this.result = obj.result || 'result';

    if (obj.products) {
      this.products = obj.products.map(p => new Products(p));
    }
  }

  isDecline() {
    return this.result === 'decline'
  }

  isSuccess() {
    return this.result === 'success';
  }

  isError() {
    return this.result === 'error';
  }

  getStatus() {
    if (this.chargeback) return 'Chargeback';

    if (this.isError()) return 'Error';

    if (this.isDecline()) return 'Decline';

    if (this.type === 'refund') return 'Refund';

    return 'Approved'
  }

  isRefund() {
    return this.type === 'refund';
  }

  isSale() {
    return this.type === 'sale';
  }

  isRefundable() {
    return this.isSuccess() && !this.chargeback && this.type !== 'refund';
  }

  copy(): Transaction {
    return new Transaction(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      alias: this.alias,
      amount: this.amount.amount,
      created_at: this.createdAt.clone().format(),
      merchant_provider: this.merchantProvider.inverse(),
      creditcard: this.creditCard.inverse(),
      processor_response: this.processorResponse.inverse(),
      rebill: this.rebill.inverse(),
      products: this.products.map(p => p.inverse()),
      chargeback: this.chargeback,
      type: this.type,
      result: this.result
    }
  }
}
