import {Moment, utc} from 'moment';
import {TransactionSummaryResult} from './transaction-summary-result.model';

export class TransactionSummary {
  time: Moment;
  results: TransactionSummaryResult[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.time = utc(obj.datetime);

    if (obj.byprocessorresult) {
      for (let i = 0; i < obj.byprocessorresult.length; i++) {
        this.results.push(new TransactionSummaryResult(obj.byprocessorresult[i]))
      }
    }
  }
}
