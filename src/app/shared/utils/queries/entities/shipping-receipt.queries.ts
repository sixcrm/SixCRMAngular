import {
  fullPaginationStringResponseQuery,
  deleteMutationQuery, deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function shippingReceiptsListQuery(params: IndexQueryParameters): string {
  return `{
    shippingreceiptlist ${listQueryParams(params)} {
			shippingreceipts {
			  ${shippingReceiptInfoResponseQuery()}
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

export function deleteShippingReceiptsMutation(id: string[]): string {
  return deleteManyMutationQuery('shippingreceipt', id);
}

export function shippingReceiptInfoResponseQuery(): string {
  return `id status fulfillment_provider { name } tracking {carrier id} created_at updated_at`
}

export function shippingReceiptResponseQuery(): string {
  return `id status tracking {carrier id} fulfillment_provider {id, name} history {created_at, status, detail} created_at updated_at`
}
