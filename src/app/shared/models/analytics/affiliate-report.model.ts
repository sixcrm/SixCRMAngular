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
      obj = {};
    }

    this.affiliate = new Affiliate(obj.affiliate);
    this.countClick = +obj.count_click || 0;
    this.countPartials = +obj.count_partials || 0;
    this.partialsPercent = +obj.partials_percent || 0;
    this.declineCount = +obj.decline_count || 0;
    this.declinesPercent = +obj.declines_percent || 0;
    this.countSales = +obj.count_sales || 0;
    this.salesPercent = +obj.sales_percent || 0;
    this.countUpsell = +obj.count_upsell || 0;
    this.upsellPercent = +obj.upsell_percent || 0;
    this.sumUpsell = new Currency(obj.sum_upsell);
    this.sumAmount = new Currency(obj.sum_amount);
  }
}
