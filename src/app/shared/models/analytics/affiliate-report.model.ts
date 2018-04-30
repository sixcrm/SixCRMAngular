import {Affiliate} from '../affiliate.model';
import {Currency} from '../../utils/currency/currency';

export class AffiliateReport {
  affiliate: Affiliate;
  countClick: number;
  countPartials: number;
  partialsPercent: number;
  declineCount: number;
  declinesPercent: number;
  countSales: number;
  salesPercent: number;
  countUpsell: number;
  upsellPercent: number;
  sumUpsell: Currency;
  sumAmount: Currency;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    this.affiliate = new Affiliate(obj.affiliate);
    this.countClick = AffiliateReport.getValueOf('clicks', obj);
    this.countPartials = AffiliateReport.getValueOf('partials', obj);
    this.partialsPercent = AffiliateReport.getValueOf('partials_percentage', obj);
    this.declineCount = AffiliateReport.getValueOf('declines', obj);
    this.declinesPercent = AffiliateReport.getValueOf('declines_percentage', obj);
    this.countSales = AffiliateReport.getValueOf('sales', obj);
    this.salesPercent = AffiliateReport.getValueOf('sales_percentage', obj);
    this.countUpsell = AffiliateReport.getValueOf('upsells', obj);
    this.upsellPercent = AffiliateReport.getValueOf('upsells_percentage', obj);
    this.sumUpsell = new Currency(AffiliateReport.getValueOf('upsels_revenue', obj));
    this.sumAmount = new Currency(AffiliateReport.getValueOf('sales_revenue', obj));
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
