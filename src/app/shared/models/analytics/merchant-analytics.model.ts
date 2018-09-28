import {Currency} from '../../utils/currency/currency';

export class MerchantAnalytics {
  gateway: string;
  providerType: string;
  currency: string;
  monthlyCap: number;
  grossOrders: number;
  sales: number;
  salesPercentage: number;
  salesRevenue: Currency;
  declines: number;
  declinePercentage: number;
  chargebacks: number;
  chargebackExpense: Currency;
  chargebackPercentage: number;
  fullRefunds: number;
  fullRefundExpense: Currency;
  fullRefundPercentage: number;
  partialRefunds: number;
  partialRefundExpense: Currency;
  partialRefundPercentage: number;
  totalRefundExpense: Currency;
  adjustedSalesRevenue: Currency;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    this.obj = obj;

    this.gateway = this.getValueOf('gateway') || '';
    this.providerType = this.getValueOf('provider_type') || '';
    this.currency = this.getValueOf('currency');
    this.monthlyCap = +this.getValueOf('monthly_cap') || 0;
    this.grossOrders = this.getValueOf('gross_orders') || 0;
    this.sales = this.getValueOf('sales') || 0;
    this.salesPercentage = this.getValueOf('sales_percentage') || 0;
    this.salesRevenue = new Currency(this.getValueOf('sales_revenue'));
    this.declines = this.getValueOf('declines') || 0;
    this.declinePercentage = this.getValueOf('decline_percentage') || 0;
    this.chargebacks = this.getValueOf('chargebacks') || 0;
    this.chargebackExpense = new Currency(this.getValueOf('chargeback_expense'));
    this.chargebackPercentage = this.getValueOf('chargeback_percentage') || 0;
    this.fullRefunds = this.getValueOf('full_refunds') || 0;
    this.fullRefundExpense = new Currency(this.getValueOf('full_refund_expense'));
    this.fullRefundPercentage = this.getValueOf('full_refund_percentage') || 0;
    this.partialRefunds = this.getValueOf('partial_refunds') || 0;
    this.partialRefundExpense = new Currency(this.getValueOf('partial_refund_expense'));
    this.partialRefundPercentage = this.getValueOf('partial_refund_percentage') || 0;
    this.totalRefundExpense = new Currency(this.getValueOf('total_refund_expenses'));
    this.adjustedSalesRevenue = new Currency(this.getValueOf('adjusted_sales_revenue'));
  }

  private getValueOf(key): any {
    for (let i = 0; i < this.obj.length; i++) {
      if (this.obj[i].key === key) {
        return this.obj[i].value;
      }
    }

    return '';
  }
}
