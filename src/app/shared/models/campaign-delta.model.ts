export class CampaignDelta {
  campaignId: string;
  campaignName: string;
  percentageChangeAmount: string;
  percentageChangeCount: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.campaignId = obj.campaign || '';
    this.campaignName = obj.campaign_name || '';
    this.percentageChangeAmount = obj.percent_change_amount || '';
    this.percentageChangeCount = obj.percent_change_count || '';
  }
}
