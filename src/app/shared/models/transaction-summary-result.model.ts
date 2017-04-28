export class TransactionSummaryResult {
  processorResult: string;
  amount: number;
  count: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.processorResult = obj.processor_result || '';
    this.amount = obj.amount || 0;
    this.count = obj.count || 0;
  }
}
