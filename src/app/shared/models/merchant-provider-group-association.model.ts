import {Entity} from './entity.interface';
import {Campaign} from './campaign.model';
import {MerchantProviderGroup} from './merchant-provider-group.model';

export class MerchantProviderGroupAssociation implements Entity<MerchantProviderGroupAssociation> {
  id: string;
  entity: string;
  entityType: string;
  campaign: Campaign;
  merchantProviderGroup: MerchantProviderGroup;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.entity = obj.entity;
    this.entityType = obj.entity_type;
    this.campaign = new Campaign(obj.campaign);
    this.merchantProviderGroup = new MerchantProviderGroup(obj.merchantprovidergroup);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): MerchantProviderGroupAssociation {
    return new MerchantProviderGroupAssociation(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      entity: this.entity,
      entity_type: this.entityType,
      campaign: this.campaign.inverse(),
      merchantprovidergroup: this.merchantProviderGroup.inverse(),
      updated_at: this.updatedAtAPI
    }
  }
}
