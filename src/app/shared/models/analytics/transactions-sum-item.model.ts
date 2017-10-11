import {Moment, utc} from 'moment';

export class TransactionsSumItem {
  period: Moment;
  saleCount: number;
  saleRevenue: number;
  rebillCount: number;
  rebillRevenue: number;
  refundExpenses: number;
  refundCount: number;
  grossRevenue: number;
  declinesCount: number;
  declinesRevenue: number;
  chargebackCount: number;
  currentActiveCustomer: number;
  countAlertCount: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.period = utc(obj.perid);
    this.saleCount = +obj.sale_count || 0;
    this.saleRevenue = +obj.sale_revenue || 0;
    this.rebillCount = +obj.rebill_count || 0;
    this.rebillRevenue = +obj.rebill_revenue || 0;
    this.refundExpenses = +obj.refund_expanses || 0;
    this.refundCount = +obj.refund_count || 0;
    this.grossRevenue = +obj.gross_revenue || 0;
    this.declinesCount = +obj.declines_count || 0;
    this.declinesRevenue = +obj.declines_revenue || 0;
    this.chargebackCount = +obj.chargeback_count || 0;
    this.currentActiveCustomer = +obj.current_active_customer || 0;
    this.countAlertCount = +obj.count_alert_count || 0;
  }
}
