import {utc, Moment} from 'moment';
import {BillDetails} from './bill-details.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {Account} from './account.model';

export class Bill implements Entity<Bill> {
  id: string;
  account: Account;
  paid: boolean;
  paidResult: string;
  outstanding: boolean;
  periodStart: Moment;
  periodEnd: Moment;
  availableAt: Moment;
  detail: BillDetails[];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  endingBalance: Currency;

  amountValue: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.account = new Account(obj.account);
    this.paid = obj.paid;
    this.paidResult = obj.paid_result;
    this.outstanding = obj.outstanding;
    this.periodStart = utc(obj.period_start_at);
    this.periodEnd = utc(obj.period_end_at);
    this.availableAt = utc(obj.available_at);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

    this.detail = [];
    if (obj.detail) {
      this.detail = obj.detail.map(d => new BillDetails(d));
    }

    this.endingBalance = new Currency(this.detail.reduce((a,b) => a + b.amount.amount, 0));

    this.amountValue = this.endingBalance.amount + '';
  }

  copy() {
    return new Bill(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      account: this.account.inverse(),
      paid: this.paid,
      paid_result: this.paidResult,
      outstanding: this.outstanding,
      period_start_at: this.periodStart.clone().format(),
      period_end_at: this.periodEnd.clone().format(),
      available_at: this.availableAt.clone().format(),
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAtAPI,
      detail: this.detail.map(d => d.inverse())
    }
  }

}
