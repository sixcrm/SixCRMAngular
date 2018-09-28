import {Currency} from '../../utils/currency/currency';

export class AffiliateAnalytics {
  affiliate: string;
  clicks: number;
  partials: number;
  partialsPercent: number;
  grossOrders: number;
  grossOrdersPercentage: number;
  sales: number;
  salesPercent: number;
  salesRevenue: Currency;
  upsells: number;
  upsellPercentage: number;
  upsellRevenue: Currency;
  blendedSales: number;
  blendedSalesRevenue: Currency;
  aov: number;
  declines: number;
  declinesPercentage: number;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    this.obj = obj;

    this.affiliate = this.getValueOf('affiliate') || '';
    this.clicks = this.getValueOf('clicks') || 0;
    this.partials = this.getValueOf('partials') || 0;
    this.partialsPercent = this.getValueOf('partials_percentage') || 0;
    this.grossOrders = this.getValueOf('gross_orders') || 0;
    this.grossOrdersPercentage = this.getValueOf('gross_order_percentage') || 0;
    this.sales = this.getValueOf('sales') || 0;
    this.salesPercent = this.getValueOf('sales_percentage') || 0;
    this.salesRevenue = new Currency(this.getValueOf('sales_revenue'));
    this.upsells = this.getValueOf('upsells') || 0;
    this.upsellPercentage = this.getValueOf('upsells_percentage') || 0;
    this.upsellRevenue = new Currency(this.getValueOf('upsells_revenue'));
    this.blendedSales = this.getValueOf('blended_sales') || 0;
    this.blendedSalesRevenue = new Currency(this.getValueOf('blended_sales_revenue'));
    this.aov = this.getValueOf('aov') || 0;
    this.declines = this.getValueOf('declines') || 0;
    this.declinesPercentage = this.getValueOf('declines_percentage') || 0;

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
