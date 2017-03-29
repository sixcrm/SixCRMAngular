import {Rebill} from './rebill.model';
import {ProcessorResponse} from './processor-response.model';
import {Entity} from './entity.interface';
import {Products} from './products.model';

export class Transaction implements Entity<Transaction>{
  id: string;
  date: string;
  amount: string;
  processorResponse: ProcessorResponse;
  rebill: Rebill;
  products: Products[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.date = obj.date || '';
    this.amount = obj.amount || '';
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
