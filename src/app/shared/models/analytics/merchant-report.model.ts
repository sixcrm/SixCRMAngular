import {Currency} from '../../utils/currency/currency';

export class MerchantReport {
  merchantProvider: string;
  saleCount: number;
  saleGrossRevenue: Currency;
  refundExpenses: Currency;
  refundCount: number;
  netRevenue: Currency;
  mtdSalesCount: number;
  mtdGrossCount: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.merchantProvider = obj.merchant_provder || '';
    this.saleCount = obj.sale_count || 0;
    this.saleGrossRevenue = new Currency(obj.sale_gross_revenue);
    this.refundExpenses = new Currency(obj.refund_expenses);
    this.refundCount = obj.refund_count || 0;
    this.netRevenue = new Currency(obj.net_revenue);
    this.mtdSalesCount = obj.mtd_sales_count || 0;
    this.mtdGrossCount = obj.mtd_gross_count || 0;
  }
}
