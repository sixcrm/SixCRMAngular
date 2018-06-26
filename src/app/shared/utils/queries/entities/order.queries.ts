import {paginationParamsQuery, fullPaginationStringResponseQuery} from './entities-helper.queries';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function ordersByCustomer(customerId: string, params: IndexQueryParameters): string {
  return `{
		orderbycustomerlist (customer:"${customerId}" ${paginationParamsQuery(params, true)}) {
			orders {
			  ${orderByCustomerResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function orderByCustomerResponseQuery(): string {
  return `id, amount, date
  products { quantity, amount
    product { id, name, sku, ship }
    returns { quantity, return{ id, alias, created_at }}
    shippingreceipt { id, status, tracking {id, carrier}, created_at, updated_at }
  }
  session { id alias created_at campaign { id name } }
  rebill { id resolved_amount created_at updated_at
    transactions { id amount alias created_at updated_at processor_response chargeback type result merchant_provider {id name}}
    paid {detail updated_at}
  }`
}
