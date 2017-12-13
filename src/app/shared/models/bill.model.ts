import {utc, Moment} from 'moment';
import {BillDetails} from './bill-details.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';

export class Bill implements Entity<Bill> {
  id: string;
  paid: boolean;
  paidResult: string;
  outstanding: boolean;
  periodStart: Moment;
  periodEnd: Moment;
  availableAt: Moment;
  detail: BillDetails[];
  createdAt: Moment;
  updatedAt: Moment;
  endingBalance: Currency;

  periodStartValue: string;
  periodEndValue: string;
  availableAtValue: string;
  amountValue: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.paid = obj.paid;
    this.paidResult = obj.paid_result;
    this.outstanding = obj.outstanding;
    this.periodStart = utc(obj.period_start_at);
    this.periodEnd = utc(obj.period_end_at);
    this.availableAt = utc(obj.available_at);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

    this.detail = [];
    if (obj.detail) {
      this.detail = obj.detail.map(d => new BillDetails(d));
    }

    this.endingBalance = new Currency(this.detail.reduce((a,b) => a + b.amount.amount, 0));

    this.periodStartValue = this.periodStart.format('MM/DD/YYYY');
    this.periodEndValue = this.periodEnd.format('MM/DD/YYYY');
    this.availableAtValue = this.availableAt.format('MM/DD/YYYY');
    this.amountValue = this.endingBalance.usd();
  }

  copy() {
    return new Bill(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      paid: this.paid,
      paid_result: this.paidResult,
      outstanding: this.outstanding,
      period_start_at: this.periodStart.clone().format(),
      period_end_at: this.periodEnd.clone().format(),
      available_at: this.availableAt.clone().format(),
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAt.clone().format(),
      detail: this.detail.map(d => d.inverse())
    }
  }

}
