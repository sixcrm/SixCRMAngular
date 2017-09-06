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
    processor { name id },
    processing { monthly_cap discount_rate transaction_fee reserve_rate maximum_chargeback_ratio,
      transaction_counts { daily weekly monthly }
    }
    gateway { name username password endpoint additional }
    customer_service { email url description phone }`
}

export function merchantProviderInfoResponseQuery(): string {
  return ` id name enabled created_at updated_at gateway { endpoint } processor { name }`
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
      ${provider.processing.discountRate ? `discount_rate: ${+provider.processing.discountRate},` : ''}
      ${provider.processing.transactionFee ? `transaction_fee: ${+provider.processing.transactionFee},` : ''}
      ${provider.processing.reserveRate ? `reserve_rate: ${+provider.processing.reserveRate},` : ''}
      ${provider.processing.maximumChargebackRatio ? `maximum_chargeback_ratio: ${+provider.processing.maximumChargebackRatio},` : ''}
      transaction_counts: {
        ${provider.processing.transactionCounts.daily ? `daily: ${provider.processing.transactionCounts.daily},` : ''}
        ${provider.processing.transactionCounts.weekly ? `weekly: ${provider.processing.transactionCounts.weekly},` : ''}
        ${provider.processing.transactionCounts.monthly ? `monthly: ${provider.processing.transactionCounts.monthly},` : ''}
      }
    },
    processor:{
      name:"NMA",
      id:"Some ID"
    },
    gateway:{
      name:"${provider.gateway.name}",
      username:"${provider.gateway.username}",
      password:"${provider.gateway.password}",
      endpoint:"${provider.gateway.endpoint}",
      ${provider.gateway.additional ? `additional: "${provider.gateway.additional.replace(/"/g, '\\"')}",` : ''}
    },
    customer_service:{
      ${provider.customerService.email ? `email: "${provider.customerService.email}",` : ''}
      ${provider.customerService.url ? `url: "${provider.customerService.url}",` : ''}
      ${provider.customerService.description ? `description: "${provider.customerService.description.replace(/"/g, '\\"')}",` : ''}
      ${provider.customerService.phone ? `phone: "${provider.customerService.phone}",` : ''}
    }
  `;
}

