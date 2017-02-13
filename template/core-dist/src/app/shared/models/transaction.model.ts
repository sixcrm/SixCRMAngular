import {Rebill} from './rebill.model';
import {ProcessorResponse} from './processor-response.model';
import {Entity} from './entity.interface';

export class Transaction implements Entity<Transaction>{
  id: string;
  date: string;
  amount: string;
  processorResponse: ProcessorResponse;
  rebill: Rebill;

  constructor(obj?: any) {
    this.id = obj.id || '';
    this.date = obj.date || '';
    this.amount = obj.amount || '';
    this.processorResponse = new ProcessorResponse(obj.processor_response);
    this.rebill = new Rebill(obj.rebill);
  }

  copy(): Transaction {
    return null;
  }
}
