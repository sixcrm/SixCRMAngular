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
		  createfulfillmentprovider ( fulfillmentprovider: { ${fulfillmentProviderInputQuery(provider, false)} }) {
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
  return `id, name, provider { ... on Hashtag { name, username, password, threepl_customer_id, threepl_key } ... on ThreePL { name, username, password, threepl_customer_id, threepl_key, threepl_id, threepl_facility_id }, ... on TestFulfillmentProvider {name} }, created_at, updated_at`;
}

export function validateFulfillmentProviderQuery(provider: FulfillmentProvider): string {
  return `
    mutation {
      fulfillmentprovidervalidation ( id: "${provider.id}" ) {
        response
      }
    }`
}


export function fulfillmentProviderInputQuery(provider: FulfillmentProvider, includeId?: boolean): string {
  let hash = '';
  if (provider.provider.name === 'ThreePL') {
    hash = `, threepl_facility_id:${provider.provider.threeplFacilityId}, threepl_id:${provider.provider.threeplId}`
  }
  let data = `name: "${provider.provider.name}"`;
  if (provider.provider.name !== 'Test') {
    data += `, username: "${provider.provider.username}", password: "${provider.provider.password}", threepl_customer_id: ${provider.provider.threeplCustomerId}, threepl_key: "${provider.provider.threeplKey}${hash}"`
  }

  return `${addId(provider.id, includeId)} name: "${provider.name}", provider: { ${data} }`;
}
