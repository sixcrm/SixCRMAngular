import {MerchantProvider} from '../../../models/merchant-provider/merchant-provider.model';
import {
  fullPaginationStringResponseQuery, deleteMutationQuery, addId,
  deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';

export function merchantProvidersListQuery(limit?:number, cursor?:string, search?: string): string {
  return `{
    merchantproviderlist ${listQueryParams(limit, cursor, search)} {
      merchantproviders {
        ${merchantProviderInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function merchantProviderQuery(id: string): string {
  return `{
    merchantprovider (id: "${id}") {
      ${merchantProviderResponseQuery()}
    }
  }`
}

export function deleteMerchantProviderMutation(id: string): string {
  return deleteMutationQuery('merchantprovider', id);
}

export function deleteMerchantProvidersMutation(id: string[]): string {
  return deleteManyMutationQuery('merchantprovider', id);
}

export function createMerchantProviderMutation(provider: MerchantProvider): string {
  return `
    mutation {
		  createmerchantprovider (merchantprovider: { ${merchantProviderInputQuery(provider)} } ) {
        ${merchantProviderResponseQuery()}
		  }
	  }`
}

export function updateMerchantProviderMutation(provider: MerchantProvider): string {
  return `
    mutation {
		  updatemerchantprovider (merchantprovider: { ${merchantProviderInputQuery(provider, true)} } ) {
			  ${merchantProviderResponseQuery()}
		  }
	  }`
}

export function merchantProviderResponseQuery(): string {
  return `
    id name enabled created_at updated_at allow_prepaid accepted_payment_methods,
    processor { name },
    processing { discount_rate transaction_fee reserve_rate maximum_chargeback_ratio monthly_cap,
      transaction_counts { daily weekly monthly }
    }
    merchantprovidergroups { id name }
    gateway {
      ... on NMI { name type username password processor_id }
      ... on TestMerchantProvider { name type }
      ... on Innovio { name type username password product_id }
      ... on Stripe {name type api_key}
    }
    customer_service { email url description phone }`
}

export function merchantProviderInfoResponseQuery(): string {
  return ` id name enabled created_at updated_at gateway { type name }`
}

export function merchantProviderInputQuery(provider: MerchantProvider, includeId?: boolean): string {
  return `
    ${addId(provider.id, includeId)},
    name:"${provider.name}",
    enabled:${provider.enabled},
    allow_prepaid:${provider.allowPrepaid},
    accepted_payment_methods:[${provider.acceptedPaymentMethods.map(m => `"${m}"`)}],
    processing:{
      monthly_cap: ${provider.processing.monthlyCap || null},
      discount_rate: ${provider.processing.discountRate ? +provider.processing.discountRate / 100 : 0},
      transaction_fee: ${provider.processing.transactionFee ? +provider.processing.transactionFee : 0},
      reserve_rate: ${provider.processing.reserveRate ? +provider.processing.reserveRate / 100 : 0},
      maximum_chargeback_ratio: ${provider.processing.maximumChargebackRatio ? +provider.processing.maximumChargebackRatio / 100 : 0},
      transaction_counts: {
        ${provider.processing.transactionCounts.daily ? `daily: ${provider.processing.transactionCounts.daily},` : ''}
        ${provider.processing.transactionCounts.weekly ? `weekly: ${provider.processing.transactionCounts.weekly},` : ''}
        ${provider.processing.transactionCounts.monthly ? `monthly: ${provider.processing.transactionCounts.monthly},` : ''}
      }
    },
    processor:{
      name:"NMA"
    },
    gateway:{
      name:"${provider.gateway.getType()}",
      type:"${provider.gateway.getType()}",
      ${provider.gateway.isNMI() ? `processor_id:"${provider.gateway.processorId}",` : provider.gateway.isInnovio() ? `product_id: "${provider.gateway.productId}",` : ''}
      ${provider.gateway.isNMI() || provider.gateway.isInnovio() ? `username:"${provider.gateway.username}",` : ''}
      ${provider.gateway.isNMI() || provider.gateway.isInnovio() ? `password:"${provider.gateway.password}",` : ''}
      ${provider.gateway.isStripe() ? `api_key:"${provider.gateway.apiKey}",` : ''}
    },
    customer_service:{
      ${provider.customerService.email ? `email: "${provider.customerService.email}",` : ''}
      ${provider.customerService.url ? `url: "${provider.customerService.url}",` : ''}
      ${provider.customerService.description ? `description: "${provider.customerService.description.replace(/"/g, '\\"')}",` : ''}
      ${provider.customerService.phone ? `phone: "${provider.customerService.phone}",` : ''}
    },
    ${addUpdatedAtApi(provider, includeId)}
  `;
}

