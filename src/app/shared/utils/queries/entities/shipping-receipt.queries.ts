import {
  paginationParamsQuery, fullPaginationStringResponseQuery,
  deleteMutationQuery
} from './entities-helper.queries';

export function shippingReceiptsListQuery(limit?:number, cursor?:string): string {
  return `{
    shippingreceiptlist ${paginationParamsQuery(limit, cursor)} {
			shippingreceipts {
			  ${shippingReceiptResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`;
}

export function shippingReceiptQuery(id: string): string {
  return `{
    shippingreceipt (id: "${id}") {
      ${shippingReceiptResponseQuery()}
		}
  }`
}

export function deleteShippingReceiptMutation(id: string): string {
  return deleteMutationQuery('shippingreceipt', id);
}

export function shippingReceiptResponseQuery(): string {
  return `id status trackingnumber created_at updated_at`
}
