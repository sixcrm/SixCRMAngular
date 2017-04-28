import {Rebill} from './rebill.model';
import {ProcessorResponse} from './processor-response.model';
import {Entity} from './entity.interface';
import {Products} from './products.model';
import {Moment, utc} from 'moment';

export class Transaction implements Entity<Transaction>{
  id: string;
  alias: string;
  amount: string;
  merchantProvider: string;
  createdAt: Moment;
  updatedAt: Moment;
  processorResponse: ProcessorResponse;
  rebill: Rebill;
  products: Products[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.alias = obj.alias || '';
    this.amount = obj.amount || '';
    this.merchantProvider = obj.merchant_provider || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.processorResponse = new ProcessorResponse(obj.processor_response);
    this.rebill = new Rebill(obj.rebill);

    this.products = [];
    if (obj.products) {
      for (let i = 0; i < obj.products.length; i++) {
        this.products.push(new Products(obj.products[i]))
      }
    }
  }

  copy(): Transaction {
    return null;
  }
}
