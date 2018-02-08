import {paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery} from './entities-helper.queries';
import {loadBalancerResponseQuery} from './load-balancer.queries';

export function sessionsInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    sessionlist ${paginationParamsQuery(limit, cursor)} {
			sessions {
			  ${sessionInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function sessionsByCustomer(customerId: string, limit?:number, cursor?:string): string {
  return `{
		sessionlistbycustomer (customer:"${customerId}" ${paginationParamsQuery(limit, cursor, true)}) {
			sessions {
			  ${sessionInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
    }
  }`
}

export function sessionsByAffiliate(affiliateId: string, limit?:number, cursor?:string): string {
  return `{
		sessionlistbyaffiliate (affiliate:"${affiliateId}" ${paginationParamsQuery(limit, cursor, true)}) {
			sessions {
			  ${sessionInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
    }
  }`
}

export function sessionQuery(id: string): string {
  return `
  {
		session (id: "${id}") {
			${sessionResponseQuery()}
		}
	}`
}

export function deleteSessionMutation(id: string): string {
  return deleteMutationQuery('session', id);
}

export function sessionResponseQuery(): string {
  return `
    id alias created_at updated_at,
    customer { id firstname lastname address { line1 line2 city state zip country } }
    affiliate { id name affiliate_id created_at updated_at }
    subaffiliate_1 { id name affiliate_id created_at updated_at }
    subaffiliate_2 { id name affiliate_id created_at updated_at }
    subaffiliate_3 { id name affiliate_id created_at updated_at }
    subaffiliate_4 { id name affiliate_id created_at updated_at }
    subaffiliate_5 { id name affiliate_id created_at updated_at }
    cid { id name affiliate_id created_at updated_at }
    rebills { id bill_at amount},
    campaign { id name }`;
}

export function sessionInfoResponseQuery(): string {
  return `id alias customer { id firstname lastname } product_schedules { id } rebills { id } campaign { id name }`;
}
