import {Currency} from '../../utils/currency/currency';
import {getValueOf} from './analytics-model.utilities';

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

    this.gateway = getValueOf(obj, 'gateway') || '';
    this.providerType = getValueOf(obj, 'provider_type') || '';
    this.currency = getValueOf(obj, 'currency');
    this.monthlyCap = +getValueOf(obj, 'monthly_cap') || 0;
    this.grossOrders = getValueOf(obj, 'gross_orders') || 0;
    this.sales = getValueOf(obj, 'sales') || 0;
    this.salesPercentage = getValueOf(obj, 'sales_percentage') || 0;
    this.salesRevenue = new Currency(getValueOf(obj, 'sales_revenue'));
    this.declines = getValueOf(obj, 'declines') || 0;
    this.declinePercentage = getValueOf(obj, 'decline_percentage') || 0;
    this.chargebacks = getValueOf(obj, 'chargebacks') || 0;
    this.chargebackExpense = new Currency(getValueOf(obj, 'chargeback_expense'));
    this.chargebackPercentage = getValueOf(obj, 'chargeback_percentage') || 0;
    this.fullRefunds = getValueOf(obj, 'full_refunds') || 0;
    this.fullRefundExpense = new Currency(getValueOf(obj, 'full_refund_expense'));
    this.fullRefundPercentage = getValueOf(obj, 'full_refund_percentage') || 0;
    this.partialRefunds = getValueOf(obj, 'partial_refunds') || 0;
    this.partialRefundExpense = new Currency(getValueOf(obj, 'partial_refund_expense'));
    this.partialRefundPercentage = getValueOf(obj, 'partial_refund_percentage') || 0;
    this.totalRefundExpense = new Currency(getValueOf(obj, 'total_refund_expenses'));
    this.adjustedSalesRevenue = new Currency(getValueOf(obj, 'adjusted_sales_revenue'));
  }
}
