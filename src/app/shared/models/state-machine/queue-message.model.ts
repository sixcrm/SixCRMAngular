import {Moment, utc} from 'moment';

export class QueueMessage {

  id: string;
  transactionId: string;
  createdAt: Moment;
  faults: number;
  accountId: string;
  merchantId: string;
  message: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.transactionId = obj.transaction_id || '';
    this.createdAt = utc(obj.created_at);
    this.faults = obj.faults || 0;
    this.accountId = obj.account || '';
    this.merchantId = obj.merchant_provider || '';
    this.message = JSON.stringify(obj);
  }

}
