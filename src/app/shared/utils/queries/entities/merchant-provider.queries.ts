import {MerchantProvider} from '../../../models/merchant-provider/merchant-provider.model';
import {
  fullPaginationStringResponseQuery, deleteMutationQuery, addId,
  paginationParamsQuery
} from './entities-helper.queries';

export function merchantProvidersListQuery(limit?:number, cursor?:string): string {
  return `{
    merchantproviderlist ${paginationParamsQuery(limit, cursor)} {
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
    gateway {
      ... on NMI { name type username password processor_id }
      ... on TestMerchantProvider { name type username password processor_id }
      ... on Innovio { name type username password product_id }
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
      monthly_cap: ${provider.processing.monthlyCap},
      ${provider.processing.discountRate ? `discount_rate: ${+provider.processing.discountRate / 100},` : ''}
      ${provider.processing.transactionFee ? `transaction_fee: ${+provider.processing.transactionFee},` : ''}
      ${provider.processing.reserveRate ? `reserve_rate: ${+provider.processing.reserveRate / 100},` : ''}
      ${provider.processing.maximumChargebackRatio ? `maximum_chargeback_ratio: ${+provider.processing.maximumChargebackRatio / 100},` : ''}
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
      ${provider.gateway.isNMI() || provider.gateway.isTest() ? `processor_id:"${provider.gateway.processorId}",` : `product_id: "${provider.gateway.productId}",`}
      username:"${provider.gateway.username}",
      password:"${provider.gateway.password}",
    },
    customer_service:{
      ${provider.customerService.email ? `email: "${provider.customerService.email}",` : ''}
      ${provider.customerService.url ? `url: "${provider.customerService.url}",` : ''}
      ${provider.customerService.description ? `description: "${provider.customerService.description.replace(/"/g, '\\"')}",` : ''}
      ${provider.customerService.phone ? `phone: "${provider.customerService.phone}",` : ''}
    }
  `;
}

