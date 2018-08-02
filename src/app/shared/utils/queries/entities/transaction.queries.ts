import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function transactionsInfoListQuery(params: IndexQueryParameters): string {
  return `{
    transactionlist ${listQueryParams(params)} {
      transactions {
        ${transactionInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function transactionQuery(id: string): string {
  return `{
    transaction (id: "${id}") {
      ${transactionResponseQuery()}
    }
	}`
}

export function deleteTransactionMutation(id: string): string {
  return deleteMutationQuery('transaction', id);
}

export function deleteTransactionsMutation(id: string[]): string {
  return deleteManyMutationQuery('transaction', id);
}

export function transactionsByCustomer(customerId: string, params: IndexQueryParameters): string {
  return `{
		transactionlistbycustomer (customer:"${customerId}" ${paginationParamsQuery(params, true)}) {
			transactions {
			  ${transactionCustomerInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
    }
  }`
}

export function refundTransactionMutation(transactionId: string, refundAmount: string): string {
  return `mutation {
		refund(refund:{amount:"${refundAmount}", transaction:"${transactionId}"}) {
			transaction { ${transactionResponseQuery()} },
			processor_response
		}
	}`
}

export function transactionIDsResponseQuery(params: IndexQueryParameters): string {
  return `{
    transactionlist ${listQueryParams(params)} {
      transactions { id created_at }
    }
  }`;
}

export function transactionInfoResponseQuery(): string {
  return 'id amount alias type result created_at updated_at merchant_provider { id name } processor_response';
}

export function transactionCustomerInfoResponseQuery(): string {
  return 'id amount alias created_at updated_at processor_response type result rebill { id parentsession { id alias } } merchant_provider { id name }';
}

export function transactionResponseQuery(): string {
  return `
    id alias amount processor_response type result created_at updated_at,
    merchant_provider { id name }
    rebill { id amount }
    products { amount,
      product { id name sku ship shipping_delay,
        fulfillment_provider {id name}
      }
      shippingreceipt { id status tracking {carrier id} created_at }
    }`;
}
