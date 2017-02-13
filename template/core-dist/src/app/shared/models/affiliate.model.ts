import {Entity} from './entity.interface';

export class Affiliate implements Entity<Affiliate> {
  id: string;
  affiliateId: string;
  subId1: string;
  subId2: string;
  subId3: string;
  subId4: string;
  subId5: string;
  clickId: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.affiliateId = obj.affiliate_id || '';
    this.subId1 = obj.sub_id_1 || '';
    this.subId2 = obj.sub_id_2 || '';
    this.subId3 = obj.sub_id_3 || '';
    this.subId4 = obj.sub_id_4 || '';
    this.subId5 = obj.sub_id_5 || '';
    this.clickId = obj.click_id || '';
  }

  copy(): Affiliate {
    return null;
  }
}
