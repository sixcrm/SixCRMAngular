import {Moment, utc} from 'moment';
import {TransactionSummaryResult} from './transaction-summary-result.model';

export class OrderVsRevenue {
  datetime: Moment;
  orders: number;
  revenue: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.datetime = utc(obj.datetime);
    this.orders = obj.orders;
    this.revenue = obj.revenue;
  }
}
