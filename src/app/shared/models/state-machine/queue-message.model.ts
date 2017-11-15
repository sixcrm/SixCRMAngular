import {Moment, utc} from 'moment';

export class QueueMessage {

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

    this.transactionId = obj.transaction_id || '';
    this.createdAt = utc(obj.created_at);
    this.faults = obj.faults || 0;
    this.accountId = obj.account_id || '';
    this.merchantId = obj.merchant_id || '';
    this.message = obj.message || '';
  }

}
