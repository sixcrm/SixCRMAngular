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

    this.merchantProvider = new MerchantProvider(MerchantReport.getValueOf('merchant_provider', obj));
    this.saleCount = MerchantReport.getValueOf('sales', obj) || 0;
    this.saleGrossRevenue = new Currency(MerchantReport.getValueOf('sales_revenue', obj));
    this.refundExpenses = new Currency(MerchantReport.getValueOf('total_refund_expenses', obj));
    this.refundCount = MerchantReport.getValueOf('full_refunds', obj) || 0 + MerchantReport.getValueOf('partial_refunds', obj) || 0;
    this.netRevenue = new Currency(MerchantReport.getValueOf('sales_revenue', obj));
    this.mtdSalesCount = MerchantReport.getValueOf('mtd_sales_count', obj) || 0;
    this.mtdGrossCount = MerchantReport.getValueOf('mtd_gross_count', obj) || 0;
  }

  public static getValueOf(field, obj) {
    if (!obj.length) {
      obj = [];
    }

    let array = obj.filter(o => o.key === field);
    if (array.length > 0) {
      return parseInt(array[0].value)
    }

    return 0;
  }
}
