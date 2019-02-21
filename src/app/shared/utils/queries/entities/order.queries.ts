import {paginationParamsQuery, fullPaginationStringResponseQuery} from './entities-helper.queries';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function ordersByCustomer(customerId: string, params: IndexQueryParameters): string {
  return `{
		orderbycustomerlist (customer:"${customerId}" ${paginationParamsQuery(params, true)}) {
			orders {
			  ${orderResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function ordersBySession(sessionId: string, params: IndexQueryParameters): string {
  return `{
		orderbysessionlist (session:"${sessionId}" ${paginationParamsQuery(params, true)}) {
			orders {
			  ${orderResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function orderResponseQuery(): string {
  return `id, amount, date
  products { quantity, amount
    product { id, name, sku, is_shippable, image_urls }
    returns { quantity, return{ id, alias, created_at }}
    shippingreceipt { id, status, fulfillment_provider_reference, tracking {id, carrier}, history {status, detail, created_at}, created_at, updated_at }
  }
  session { id alias created_at campaign { id name } trial_confirmation {id code delivered_at confirmed_at} }
  rebill { id resolved_amount alias cycle created_at updated_at bill_at
    transactions {
    	id amount alias created_at updated_at processor_response chargeback type result
    	creditcard { id, last_four, type }
    	merchant_provider {id name}
    	products { amount, product { id } shippingreceipt { id } }
		}
    paid {detail updated_at}
  }`
}
