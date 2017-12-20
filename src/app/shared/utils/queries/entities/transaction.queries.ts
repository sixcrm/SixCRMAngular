import {paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery} from './entities-helper.queries';

export function transactionsInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    transactionlist ${paginationParamsQuery(limit, cursor)} {
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

export function transactionsByCustomer(customerId: string, limit?:number, cursor?:string): string {
  return `{
		transactionlistbycustomer (customer:"${customerId}" ${paginationParamsQuery(limit, cursor, true)}) {
			transactions {
			  ${transactionInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
    }
  }`
}

export function refundTransactionMutation(transactionId: string, refundAmount: number): string {
  return `mutation {
		refund(refund:{amount:"${refundAmount}", transaction:"${transactionId}"}) {
			transaction {${transactionResponseQuery()}},
			processor_response
		}
	}`
}

export function transactionInfoResponseQuery(): string {
  return 'id amount alias created_at processor_response';
}

export function transactionResponseQuery(): string {
  return `
    id alias amount processor_response created_at updated_at,
    merchant_provider { id name }
    rebill { id amount }
    products { amount,
      product { id name sku ship shipping_delay,
        fulfillment_provider {id name}
      }
      shippingreceipt { id status trackingnumber created_at }
    }`;
}
