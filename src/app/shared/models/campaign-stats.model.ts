import {Currency} from '../utils/currency/currency';

export class CampaignStats {
  campaign: string;
  campaign_name: string;
  amount: Currency;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.campaign = this.getValueOf('campaign') || '';
    this.campaign_name = this.getValueOf('campaign_name') || '';
    this.amount = new Currency(this.getValueOf('amount'));
  }

  private getValueOf(key): any {
    let array = this.obj.filter(o => o.key === key);

    if (array.length < 1) {
      return '';
    }

    return array[0].value;
  }
}
