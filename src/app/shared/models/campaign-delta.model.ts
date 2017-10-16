export class CampaignDelta {
  campaignId: string;
  campaignName: string;
  percentageChangeAmount: string;
  percentageChangeCount: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    if (!obj.campaign) {
      obj.campaign = {};
    }

    this.campaignId = obj.campaign.id || '';
    this.campaignName = obj.campaign.name || '';
    this.percentageChangeAmount = obj.percent_change_amount || '';
    this.percentageChangeCount = obj.percent_change_count || '';
  }
}
