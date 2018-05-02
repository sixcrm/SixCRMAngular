import {Currency} from '../../utils/currency/currency';
import {MerchantProvider} from '../merchant-provider/merchant-provider.model';

export class MerchantReport {
  merchantProvider: MerchantProvider;
  saleCount: number;
  saleGrossRevenue: Currency;
  refundExpenses: Currency;
  refundCount: number;
  netRevenue: Currency;
  mtdSalesCount: number;
  mtdGrossCount: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    this.merchantProvider = new MerchantProvider(obj.merchant_provider);
    this.saleCount = obj.sales || 0;
    this.saleGrossRevenue = new Currency(obj.sales_revenue);
    this.refundExpenses = new Currency(obj.total_refund_expenses);
    this.refundCount = obj.full_refunds || 0 + obj.partial_refunds || 0;
    this.netRevenue = new Currency(obj.sales_revenue);
    this.mtdSalesCount = obj.mtd_sales_count || 0;
    this.mtdGrossCount = obj.mtd_gross_count || 0;
  }
}
