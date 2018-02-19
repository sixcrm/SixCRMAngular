import {Entity} from './entity.interface';
import {Campaign} from './campaign.model';
import {LoadBalancer} from './load-balancer.model';

export class LoadBalancerAssociation implements Entity<LoadBalancerAssociation> {
  id: string;
  entity: string;
  entityType: string;
  campaign: Campaign;
  loadbalancer: LoadBalancer;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.entity = obj.entity;
    this.entityType = obj.entity_type;
    this.campaign = new Campaign(obj.campaign);
    this.loadbalancer = new LoadBalancer(obj.loadbalancer);
  }

  copy(): LoadBalancerAssociation {
    return new LoadBalancerAssociation(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      entity: this.entity,
      entity_type: this.entityType,
      campaign: this.campaign.inverse(),
      loadbalancer: this.loadbalancer.inverse()
    }
  }
}
