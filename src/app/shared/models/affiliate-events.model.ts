export class AffiliateData {
  affiliate: string;
  count: number;
  percentage: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.affiliate = obj.affiliate || '';
    this.count = obj.count ? Number(obj.count) : 0;
    this.percentage = obj.percentage || '-';
  }
}

export class AffiliateEvents {
  count: number;
  affiliates: AffiliateData[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.count = obj.count || 0;

    if (obj.affiliates || obj.affiliates.length > 0) {
      obj.affiliates.forEach(affiliate => this.affiliates.push(new AffiliateData(affiliate)));
    }
  }
}
