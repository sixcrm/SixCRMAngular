import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {Rebill} from '../../../models/rebill.model';

export function rebillsListQuery(limit?: number, cursor?: string, search?: string): string {
  return `{
		rebilllist ${listQueryParams(limit, cursor, search)} {
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

export function rebillsByCustomer(customerId: string, limit?: number, cursor?: string): string {
  return `{
		rebilllistbycustomer (customer:"${customerId}" ${paginationParamsQuery(limit, cursor, true)}) {
			rebills {
			  ${rebillInfoResponseQuery()}
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
    id bill_at amount created_at updated_at,
    parentsession { id,
      customer { id firstname lastname,
        address { line1 line2 city state zip },
        creditcards {	id number expiration ccv name,
          address { line1 line2 city state zip country }
        }
      }
      campaign { id, name }
    }
    product_schedules { id, name,
      loadbalancer { name },
      schedule { price start end period,
        product { id name sku }
      }
    },
    transactions { id amount alias created_at updated_at processor_response}
    shippingreceipts { id, status, tracking {id, carrier}, created_at, updated_at },
    state, previous_state,
    history { state entered_at exited_at error_message }
  `
}

export function rebillInfoResponseQuery(): string {
  return `id bill_at amount created_at updated_at`
}

export function rebillListByState(queueName: string, limit?: number, offset?: number): string {
  return `
    query {rebillsinqueue (pagination: { limit: ${limit || 10}, offset: ${offset || 0} }, queuename:"${queueName}"){
		  rebills { id, bill_at, amount, created_at, updated_at }
    }}`
}

export function rebillInputQuery(rebill: Rebill, includeId?: boolean): string {
  let schedules = rebill.productSchedules.map(p => p.id).reduce((a,b) => `${a} "${b}",`, '');

  return `${addId(rebill.id, includeId)} bill_at:"${rebill.billAt.format()}", parentsession: "${rebill.parentSession.id}", amount:"${rebill.amount.amount}", product_schedules:[${schedules}]`
}
