import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId
} from './entities-helper.queries';
import {Rebill} from '../../../models/rebill.model';

export function rebillsListQuery(limit?: number, cursor?: string): string {
  return `{
		rebilllist ${paginationParamsQuery(limit, cursor)} {
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
    product_schedules { id,
      schedule { price start end period,
        product { id name sku ship shipping_delay,
          fulfillment_provider { id name provider username password endpoint }
        }
      }
    },
    transactions { id processor_response amount },
    history { state entered_at exited_at error_message }
  `
}

export function rebillInfoResponseQuery(): string {
  return `
    id bill_at amount created_at updated_at,
    parentsession { id,
      customer { id firstname lastname }
    }
    product_schedules { id }
    transactions { id processor_response amount }`
}

export function rebillListByState(queueName: string, limit?: number, cursor?: string): string {
  return `
    query {rebilllistbystate (state:"${queueName}" ${paginationParamsQuery(limit, cursor, true)}){
		  rebills { id, bill_at, amount, created_at, updated_at },
		  pagination {count, end_cursor, has_next_page}}
    }`
}

export function rebillInputQuery(rebill: Rebill, includeId?: boolean): string {
  let schedules = rebill.productSchedules.map(p => p.id).reduce((a,b) => `${a} "${b}",`, '');

  return `${addId(rebill.id, includeId)} bill_at:"${rebill.billAt.format()}", parentsession: "${rebill.parentSession.id}", amount:"${rebill.amount.amount}", product_schedules:[${schedules}]`
}
