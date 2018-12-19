import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {MerchantProviderGroupAssociation} from '../../../models/merchant-provider-group-association.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function merchantProviderGroupAssociationsListQuery(params: IndexQueryParameters): string {
  return `{
    merchantprovidergroupassociationlist ${listQueryParams(params)} {
			merchantprovidergroupassociations { 
			  ${merchantProviderGroupAssociationResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function merchantProviderGroupAssociationsByEntityListQuery(entityId: string, params: IndexQueryParameters): string {
  return `{
    merchantprovidergroupassociationbyentitylist ( entity: "${entityId}", ${listQueryParams(params, true)} ) {
			merchantprovidergroupassociations { 
			  ${merchantProviderGroupAssociationResponseQuery()} 
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function merchantProviderGroupAssociationQuery(id: string): string {
  return `
    {
      merchantprovidergroupassociation (id: "${id}") {
        ${merchantProviderGroupAssociationResponseQuery()}
      }
    }`
}

export function createMerchantProviderGroupAssociationMutation(merchantProviderGroupAssociation: MerchantProviderGroupAssociation): string {
  return `
    mutation {
      createmerchantprovidergroupassociation ( merchantprovidergroupassociation: { ${merchantProviderGroupAssociationInputQuery(merchantProviderGroupAssociation)} } ) {
        ${merchantProviderGroupAssociationResponseQuery()}
      }
	  }`
}

export function updateMerchantProviderGroupAssociationMutation(merchantProviderGroupAssociation: MerchantProviderGroupAssociation): string {
  return `
    mutation {
      updatemerchantprovidergroupassociation ( merchantprovidergroupassociation: { ${merchantProviderGroupAssociationInputQuery(merchantProviderGroupAssociation, true)} } ) {
        ${merchantProviderGroupAssociationResponseQuery()}
      }
	  }`
}

export function deleteMerchantProviderGroupAssociationMutation(id: string): string {
  return deleteMutationQuery('merchantprovidergroupassociation', id);
}

export function deleteMerchantProviderGroupAssociationssMutation(id: string[]): string {
  return deleteManyMutationQuery('merchantprovidergroupassociation', id);
}

export function merchantProviderGroupAssociationResponseQuery(): string {
  return `id entity entity_type campaign {id name} merchantprovidergroup {id name} updated_at`
}

export function merchantProviderGroupAssociationInputQuery(merchantProviderGroupAssociation: MerchantProviderGroupAssociation, includeId?: boolean): string {
  return `${addId(merchantProviderGroupAssociation.id, includeId)}, entity: "${merchantProviderGroupAssociation.entity}", entity_type: "${merchantProviderGroupAssociation.entityType}", campaign: "${merchantProviderGroupAssociation.campaign.id}", merchantprovidergroup: "${merchantProviderGroupAssociation.merchantProviderGroup.id}", ${addUpdatedAtApi(merchantProviderGroupAssociation, includeId)}`;
}
