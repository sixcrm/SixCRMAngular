import {Currency} from '../utils/currency/currency';

export class TransactionOverview {

  newSale: TransactionOverviewResult;
  rebill: TransactionOverviewResult;
  decline: TransactionOverviewResult;
  error: TransactionOverviewResult;
  main: TransactionOverviewResult;
  upsell: TransactionOverviewResult;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.newSale = new TransactionOverviewResult(obj.newsale);
    this.rebill = new TransactionOverviewResult(obj.rebill);
    this.decline = new TransactionOverviewResult(obj.decline);
    this.error = new TransactionOverviewResult(obj.error);
    this.main = new TransactionOverviewResult(obj.main);
    this.upsell = new TransactionOverviewResult(obj.upsell);
  }
}

export class TransactionOverviewResult {
  count: number;
  amount: Currency;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.count = obj.count || 0;
    this.amount = new Currency(obj.amount);
  }
}
