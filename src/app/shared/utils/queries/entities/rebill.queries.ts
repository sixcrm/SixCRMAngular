import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {Rebill} from '../../../models/rebill.model';
import {IndexQueryParameters} from '../index-query-parameters.model';
import {sessionResponseQuery} from './session.queries';

export function rebillsListQuery(params: IndexQueryParameters): string {
  return `{
		rebilllist ${listQueryParams(params)} {
			rebills {
			  ${rebillInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function rebillQuery(id: string): string {
  return `{
		rebill (id: "${id}") {
			${rebillResponseQuery()}
    }
  }`
}

export function rebillWithFullSessionQuery(id: string): string {
  return `{
		rebill (id: "${id}") {
			${rebillWithSessionResponse()}
    }
  }`
}

export function pendingRebillsByCustomer(customerId: string, params: IndexQueryParameters): string {
  return `{
		pendingrebillsforcustomer (customer:"${customerId}" ${paginationParamsQuery(params, true)}) {
			rebills {
			  ${rebillByCustomerResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function deleteRebillMutation(id: string): string {
  return deleteMutationQuery('rebill', id);
}

export function deleteRebillsMutation(id: string[]): string {
  return deleteManyMutationQuery('rebill', id);
}

export function updateRebillMutation(rebill: Rebill): string {
  return `
    mutation {
      updaterebill ( rebill: { ${rebillInputQuery(rebill, true)} } ) {
        ${rebillInfoResponseQuery()}
      }
    }`;
}

export function rebillResponseQuery(): string {
  return `
    id bill_at amount cycle created_at updated_at,
    parentsession { id,
      customer { id firstname lastname,
        address { line1 line2 city state zip },
        creditcards {	id expiration last_four first_six name created_at,
          address { line1 line2 city state zip country }
        }
      }
      campaign { id, name }
    }
    product_schedules { id, name,
      merchantprovidergroup { id name },
      schedule { price start end period,
        product { id name sku }
      }
    },
    transactions { id amount alias created_at updated_at processor_response type result}
    shippingreceipts { id, status, tracking {id, carrier}, created_at, updated_at },
    state, previous_state,
    history { state entered_at exited_at error_message }
    paid {detail updated_at}
  `
}

export function rebillWithSessionResponse(): string {
  return `
    id bill_at created_at updated_at,
    parentsession { 
      ${sessionResponseQuery()}
    }
  `
}

export function rebillInfoResponseQuery(): string {
  return `id bill_at amount created_at updated_at state parentsession { id customer { firstname lastname} }`
}

export function rebillByCustomerResponseQuery(): string {
  return `id bill_at amount created_at updated_at state
  products { quantity, amount, product { id, name, sku, ship } }
  parentsession { id alias created_at campaign { id name } }`
}

export function rebillInputQuery(rebill: Rebill, includeId?: boolean): string {
  let schedules = rebill.productSchedules.map(p => p.id).reduce((a,b) => `${a} "${b}",`, '');

  return `${addId(rebill.id, includeId)} bill_at:"${rebill.billAt.format()}", parentsession: "${rebill.parentSession.id}", amount:"${rebill.amount.amount}", product_schedules:[${schedules}], ${addUpdatedAtApi(rebill, includeId)}`
}
