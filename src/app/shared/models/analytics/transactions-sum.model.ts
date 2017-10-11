import {TransactionsSumItem} from './transactions-sum-item.model';

export class TransactionsSum {

  sum: TransactionsSumItem;
  items: TransactionsSumItem[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    if (obj.periods) {
      this.items = obj.periods.map(item => new TransactionsSumItem(item));
    }

    this.sum = new TransactionsSumItem();

    if (this.items.length > 0) {
      const f = (a,b) => a+b;
      this.sum.saleCount = this.items.map(item => item.saleCount).reduce(f,0);
      this.sum.saleRevenue = this.items.map(item => item.saleRevenue).reduce(f,0);
      this.sum.rebillCount = this.items.map(item => item.rebillCount).reduce(f,0);
      this.sum.rebillRevenue = this.items.map(item => item.rebillRevenue).reduce(f,0);
      this.sum.refundExpenses = this.items.map(item => item.refundExpenses).reduce(f,0);
      this.sum.refundCount = this.items.map(item => item.refundCount).reduce(f,0);
      this.sum.grossRevenue = this.items.map(item => item.grossRevenue).reduce(f,0);
      this.sum.declinesCount = this.items.map(item => item.declinesCount).reduce(f,0);
      this.sum.declinesRevenue = this.items.map(item => item.declinesRevenue).reduce(f,0);
      this.sum.chargebackCount = this.items.map(item => item.chargebackCount).reduce(f,0);
      this.sum.currentActiveCustomer = this.items.map(item => item.currentActiveCustomer).reduce(f,0);
      this.sum.countAlertCount = this.items.map(item => item.countAlertCount).reduce(f,0);
    }
  }
}
