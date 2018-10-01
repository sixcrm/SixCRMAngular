import {Currency} from '../../utils/currency/currency';
import {getValueOf} from './analytics-model.utilities';

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

    this.affiliate = getValueOf(obj, 'affiliate') || '';
    this.clicks = getValueOf(obj, 'clicks') || 0;
    this.partials = getValueOf(obj, 'partials') || 0;
    this.partialsPercent = getValueOf(obj, 'partials_percentage') || 0;
    this.grossOrders = getValueOf(obj, 'gross_orders') || 0;
    this.grossOrdersPercentage = getValueOf(obj, 'gross_order_percentage') || 0;
    this.sales = getValueOf(obj, 'sales') || 0;
    this.salesPercent = getValueOf(obj, 'sales_percentage') || 0;
    this.salesRevenue = new Currency(getValueOf(obj, 'sales_revenue'));
    this.upsells = getValueOf(obj, 'upsells') || 0;
    this.upsellPercentage = getValueOf(obj, 'upsells_percentage') || 0;
    this.upsellRevenue = new Currency(getValueOf(obj, 'upsells_revenue'));
    this.blendedSales = getValueOf(obj, 'blended_sales') || 0;
    this.blendedSalesRevenue = new Currency(getValueOf(obj, 'blended_sales_revenue'));
    this.aov = getValueOf(obj, 'aov') || 0;
    this.declines = getValueOf(obj, 'declines') || 0;
    this.declinesPercentage = getValueOf(obj, 'declines_percentage') || 0;

  }
}
