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
    customer_service { email url description }`
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
      discount_rate: ${provider.processing.discountRate},
      transaction_fee: ${provider.processing.transactionFee},
      reserve_rate: ${provider.processing.reserveRate},
      maximum_chargeback_ratio: ${provider.processing.maximumChargebackRatio},
      transaction_counts: {
        daily:${provider.processing.transactionCounts.daily},
        weekly:${provider.processing.transactionCounts.weekly},
        monthly:${provider.processing.transactionCounts.monthly}
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
      additional:"${provider.gateway.additional.replace(/"/g, '\\"')}"
    },
    customer_service:{
      email:"${provider.customerService.email}",
      url:"${provider.customerService.url}",
      description:"${provider.customerService.description.replace(/"/g, '\\"')}"
    }
  `;
}

