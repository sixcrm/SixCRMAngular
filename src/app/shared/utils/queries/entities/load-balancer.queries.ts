import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {merchantProviderResponseQuery} from './merchant-provider.queries';
import {LoadBalancer} from '../../../models/load-balancer.model';

export function loadBalancersInfoListQuery(limit?:number, cursor?:string, search?: string): string {
  return `{
    merchantprovidergrouplist ${listQueryParams(limit, cursor, search)} {
			merchantprovidergroups { 
			  ${loadBalancerInfoResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function loadBalancerQuery(id: string): string {
  return `
    {
      merchantprovidergroup (id: "${id}") {
        ${loadBalancerResponseQuery()}
      }
    }`
}

export function createLoadBalancerMutation(loadBalancer: LoadBalancer): string {
  return `
    mutation {
      createmerchantprovidergroup ( merchantprovidergroup: { ${loadBalancerInputQuery(loadBalancer)} } ) {
        ${loadBalancerResponseQuery()}
      }
	  }`
}

export function updateLoadBalancerMutation(loadBalancer: LoadBalancer): string {
  return `
    mutation {
      updatemerchantprovidergroup ( merchantprovidergroup: { ${loadBalancerInputQuery(loadBalancer, true)} } ) {
        ${loadBalancerResponseQuery()}
      }
	  }`
}

export function deleteLoadBalancerMutation(id: string): string {
  return deleteMutationQuery('merchantprovidergroup', id);
}

export function deleteLoadBalancersMutation(id: string[]): string {
  return deleteManyMutationQuery('merchantprovidergroup', id);
}

export function loadBalancerResponseQuery(): string {
  return `
    id name created_at updated_at,
    merchantproviderconfigurations { distribution
      merchantprovider {
        ${merchantProviderResponseQuery()}
      }
    }`
}

export function loadBalancerInfoResponseQuery(): string {
  return `id name merchantproviderconfigurations { merchantprovider { name } }`
}

export function loadBalancerInputQuery(loadBalancer: LoadBalancer, includeId?: boolean): string {
  let providers = loadBalancer.merchantProviderConfigurations.reduce((a,b) => `${a} {id: "${b.merchantProvider.id}", distribution: ${+b.distribution}} `, '');

  return `${addId(loadBalancer.id, includeId)}, ${loadBalancer.name ? `name: "${loadBalancer.name}",`: ''} merchantproviders: [${providers}]`;
}
