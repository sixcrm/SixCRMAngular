import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {LoadBalancerAssociation} from '../../../models/load-balancer-association.model';

export function loadBalancerAssociationsListQuery(limit?:number, cursor?:string, search?: string): string {
  return `{
    merchantprovidergroupassociationlist ${listQueryParams(limit, cursor, search)} {
			merchantprovidergroupassociations { 
			  ${loadBalancerAssociationResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function loadBalancerAssociationsByEntityListQuery(entityId: string, limit?:number, cursor?:string, search?: string): string {
  return `{
    merchantprovidergroupassociationbyentitylist ( entity: "${entityId}", ${listQueryParams(limit, cursor, search, true)} ) {
			merchantprovidergroupassociations { 
			  ${loadBalancerAssociationResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function loadBalancerAssociationQuery(id: string): string {
  return `
    {
      merchantprovidergroupassociation (id: "${id}") {
        ${loadBalancerAssociationResponseQuery()}
      }
    }`
}

export function createLoadBalancerAssociationMutation(loadBalancerAssociation: LoadBalancerAssociation): string {
  return `
    mutation {
      createmerchantprovidergroupassociation ( merchantprovidergroupassociation: { ${loadBalancerAssociationInputQuery(loadBalancerAssociation)} } ) {
        ${loadBalancerAssociationResponseQuery()}
      }
	  }`
}

export function deleteLoadBalancerAssociationMutation(id: string): string {
  return deleteMutationQuery('merchantprovidergroupassociation', id);
}

export function deleteLoadBalancerAssociationssMutation(id: string[]): string {
  return deleteManyMutationQuery('merchantprovidergroupassociation', id);
}

export function loadBalancerAssociationResponseQuery(): string {
  return `id entity entity_type campaign {id name} merchantprovidergroup {id name}`
}

export function loadBalancerAssociationInputQuery(loadBalancerAssociation: LoadBalancerAssociation, includeId?: boolean): string {
  return `${addId(loadBalancerAssociation.id, includeId)}, entity: "${loadBalancerAssociation.entity}", entity_type: "${loadBalancerAssociation.entityType}", campaign: "${loadBalancerAssociation.campaign.id}", merchantprovidergroup: "${loadBalancerAssociation.loadbalancer.id}"`;
}
