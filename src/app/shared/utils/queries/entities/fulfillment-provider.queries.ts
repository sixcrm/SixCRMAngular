import {
  deleteMutationQuery, paginationParamsQuery, fullPaginationStringResponseQuery,
  addId, generateUUID
} from './entities-helper.queries';

import {FulfillmentProvider} from '../../../models/fulfillment-provider.model';

export function fulfillmentProvidersListQuery(limit?:number, cursor?:string): string {
  return `{
    fulfillmentproviderlist ${paginationParamsQuery(limit, cursor)} {
      fulfillmentproviders {
        ${fulfillmentProviderResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function fulfillmentProviderQuery(id: string): string {
  return `{
    fulfillmentprovider (id: "${id}") {
      ${fulfillmentProviderResponseQuery()}
    }
  }`
}

export function deleteFulfillmentProviderMutation(id: string): string {
  return deleteMutationQuery('fulfillmentprovider', id);
}

export function createFulfillmentProviderMutation(provider: FulfillmentProvider): string {
  return `
    mutation {
		  createfulfillmentprovider ( fulfillmentprovider: { ${fulfillmentProviderInputQuery(provider, true)} }) {
			  ${fulfillmentProviderResponseQuery()}
		  }
	  }`
}

export function updateFulfillmentProviderMutation(provider: FulfillmentProvider): string {
  return `
    mutation {
		  updatefulfillmentprovider ( fulfillmentprovider: { ${fulfillmentProviderInputQuery(provider, true)} }) {
			  ${fulfillmentProviderResponseQuery()}
		  }
	  }`
}

export function fulfillmentProviderResponseQuery(): string {
  return `id name username password endpoint provider threepl_key facility_id threepl_id customer_id return_address,`;
}

export function fulfillmentProviderInputQuery(provider: FulfillmentProvider, includeId?: boolean): string {
  if (!provider.id) provider.id = generateUUID();

  const endpoint = provider.endpoint ? `, endpoint: "${provider.endpoint}"` : '';
  const threePLId = provider.threePLId ? `, threepl_id: "${provider.threePLId}"` : '';
  const facilityId = provider.facilityId ? `, facility_id: "${provider.facilityId}"` : '';
  const threePLKey = provider.threePLKey ? `, threepl_key: "${provider.threePLKey}"` : '';
  const customerId = provider.customerId ? `, customer_id: "${provider.customerId}"` : '';
  const returnAddress = provider.returnAddress ? `, return_address: "${provider.returnAddress}"` : '';

  return `${addId(provider.id, includeId)}, name: "${provider.name}", username: "${provider.username}", password: "${provider.password}", provider: "${provider.provider}"${endpoint}${threePLId}${threePLKey}${facilityId}${customerId}${returnAddress}`;
}
