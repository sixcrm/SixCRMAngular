import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {merchantProviderResponseQuery} from './merchant-provider.queries';
import {MerchantProviderGroup} from '../../../models/merchant-provider-group.model';

export function merchantProviderGroupsInfoListQuery(limit?:number, cursor?:string, search?: string): string {
  return `{
    merchantprovidergrouplist ${listQueryParams(limit, cursor, search)} {
			merchantprovidergroups { 
			  ${merchantProviderGroupInfoResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function merchantProviderGroupQuery(id: string): string {
  return `
    {
      merchantprovidergroup (id: "${id}") {
        ${merchantProviderGroupResponseQuery()}
      }
    }`
}

export function createMerchantProviderGroupMutation(merchantProviderGroup: MerchantProviderGroup): string {
  return `
    mutation {
      createmerchantprovidergroup ( merchantprovidergroup: { ${merchantProviderGroupInputQuery(merchantProviderGroup)} } ) {
        ${merchantProviderGroupResponseQuery()}
      }
	  }`
}

export function updateMerchantProviderGroupMutation(merchantProviderGroup: MerchantProviderGroup): string {
  return `
    mutation {
      updatemerchantprovidergroup ( merchantprovidergroup: { ${merchantProviderGroupInputQuery(merchantProviderGroup, true)} } ) {
        ${merchantProviderGroupResponseQuery()}
      }
	  }`
}

export function deleteMerchantProviderGroupMutation(id: string): string {
  return deleteMutationQuery('merchantprovidergroup', id);
}

export function deleteMerchantProviderGroupsMutation(id: string[]): string {
  return deleteManyMutationQuery('merchantprovidergroup', id);
}

export function merchantProviderGroupResponseQuery(): string {
  return `
    id name created_at updated_at,
    merchantproviderconfigurations { distribution
      merchantprovider {
        ${merchantProviderResponseQuery()}
      }
    }`
}

export function merchantProviderGroupInfoResponseQuery(): string {
  return `id name merchantproviderconfigurations { merchantprovider { name } }`
}

export function merchantProviderGroupInputQuery(merchantProviderGroup: MerchantProviderGroup, includeId?: boolean): string {
  let providers = merchantProviderGroup.merchantProviderConfigurations.reduce((a,b) => `${a} {id: "${b.merchantProvider.id}", distribution: ${+b.distribution}} `, '');

  return `${addId(merchantProviderGroup.id, includeId)}, ${merchantProviderGroup.name ? `name: "${merchantProviderGroup.name}",`: ''} merchantproviders: [${providers}]`;
}
