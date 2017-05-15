export class CampaignStats {
  campaign: string;
  amount: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {}
    }

    this.campaign = obj.campaign || '';
    this.amount = obj.amount || 0;
  }
}
