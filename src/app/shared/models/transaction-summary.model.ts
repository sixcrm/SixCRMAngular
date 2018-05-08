import {Moment, utc} from 'moment';
import {TransactionSummaryResult} from './transaction-summary-result.model';

export class TransactionSummary {
  time: Moment;
  results: TransactionSummaryResult[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    for (let element of obj) {
      if (element.key === 'datetime') {
        this.time = utc(element.value)
      }

      if (element.key === 'processorResults') {
        for (let i = 0; i < element.value.length; i++) {
          let result = element.value[i];
          result.processor_result = element.value[i].key;
          this.results.push(new TransactionSummaryResult(result));
        }
      }
    }
  }
}
