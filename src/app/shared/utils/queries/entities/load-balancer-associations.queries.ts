import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {LoadBalancerAssociation} from '../../../models/load-balancer-association.model';

export function loadBalancerAssociationsListQuery(limit?:number, cursor?:string, search?: string): string {
  return `{
    loadbalancerassociationlist ${listQueryParams(limit, cursor, search)} {
			loadbalancerassociations { 
			  ${loadBalancerAssociationResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function loadBalancerAssociationQuery(id: string): string {
  return `
    {
      loadbalancerassociation (id: "${id}") {
        ${loadBalancerAssociationResponseQuery()}
      }
    }`
}

export function createLoadBalancerAssociationMutation(loadBalancerAssociation: LoadBalancerAssociation): string {
  return `
    mutation {
      createloadbalancerassociation ( loadbalancerassociation: { ${loadBalancerAssociationInputQuery(loadBalancerAssociation)} } ) {
        ${loadBalancerAssociationResponseQuery()}
      }
	  }`
}

export function deleteLoadBalancerAssociationMutation(id: string): string {
  return deleteMutationQuery('loadbalancerassociation', id);
}

export function deleteLoadBalancerAssociationssMutation(id: string[]): string {
  return deleteManyMutationQuery('loadbalancerassociation', id);
}

export function loadBalancerAssociationResponseQuery(): string {
  return `id entity entity_type campaign {id name} loadbalancer {id name}`
}

export function loadBalancerAssociationInputQuery(loadBalancerAssociation: LoadBalancerAssociation, includeId?: boolean): string {
  return `${addId(loadBalancerAssociation.id, includeId)}, entity: "${loadBalancerAssociation.entity}", entity_type: "${loadBalancerAssociation.entityType}", campaign: "${loadBalancerAssociation.campaign.id}", loadbalancer: "${loadBalancerAssociation.loadbalancer.id}"`;
}
