import {Currency} from '../utils/currency/currency';

export class CampaignStats {
  campaign: string;
  amount: Currency;

  constructor(obj?: any) {
    if (!obj) {
      obj = {}
    }

    this.campaign = obj.campaign || '';
    this.amount = new Currency(obj.amount);
  }
}
