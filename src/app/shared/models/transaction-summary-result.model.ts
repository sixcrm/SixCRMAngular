export class TransactionSummaryResult {
  processorResult: string;
  amount: number;
  count: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.processorResult = obj.processor_result || '';
    this.amount = obj.value.total || 0;
    this.count = obj.value.count || 0;
  }
}
