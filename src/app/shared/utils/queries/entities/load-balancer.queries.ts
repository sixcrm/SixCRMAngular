import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId
} from './entities-helper.queries';
import {merchantProviderResponseQuery} from './merchant-provider.queries';
import {LoadBalancer} from '../../../models/load-balancer.model';

export function loadBalancersInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    loadbalancerlist ${paginationParamsQuery(limit, cursor)} {
			loadbalancers { 
			  ${loadBalancerInfoResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function loadBalancerQuery(id: string): string {
  return `
    {
      loadbalancer (id: "${id}") {
        ${loadBalancerResponseQuery()}
      }
    }`
}

export function createLoadBalancerMutation(loadBalancer: LoadBalancer): string {
  return `
    mutation {
      createloadbalancer ( loadbalancer: { ${loadBalancerInputQuery(loadBalancer)} } ) {
        ${loadBalancerResponseQuery()}
      }
	  }`
}

export function updateLoadBalancerMutation(loadBalancer: LoadBalancer): string {
  return `
    mutation {
      updateloadbalancer ( loadbalancer: { ${loadBalancerInputQuery(loadBalancer, true)} } ) {
        ${loadBalancerResponseQuery()}
      }
	  }`
}

export function deleteLoadBalancerMutation(id: string): string {
  return deleteMutationQuery('loadbalancer', id);
}

export function loadBalancerResponseQuery(): string {
  return `
    id created_at updated_at,
    merchantproviderconfigurations { distribution
      merchantprovider {
        ${merchantProviderResponseQuery()}
      }
    }`
}

export function loadBalancerInfoResponseQuery(): string {
  return `id merchantproviderconfigurations { merchantprovider { name } }`
}

export function loadBalancerInputQuery(loadBalancer: LoadBalancer, includeId?: boolean): string {
  let providers = loadBalancer.merchantProviderConfigurations.reduce((a,b) => `${a} {id: "${b.merchantProvider.id}", distribution: "${b.distribution}"} `, '');

  return `${addId(loadBalancer.id, includeId)}, merchantproviders: [${providers}]`;
}
