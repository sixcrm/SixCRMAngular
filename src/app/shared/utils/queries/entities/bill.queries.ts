import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery
} from './entities-helper.queries';
import {Bill} from '../../../models/bill.model';

export function billListQuery(limit?:number, cursor?:string): string {
  return `{
    billlist ${paginationParamsQuery(limit, cursor)} {
      bills {
        ${billResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function billQuery(id: string): string {
  return `{
    bill (id: "${id}") {
      ${billResponseQuery()}
		}
  }`
}

export function deleteBillMutation(id: string): string {
  return deleteMutationQuery('bill', id);
}

export function deleteBillsMutation(id: string[]): string {
  return deleteManyMutationQuery('bill', id);
}

export function createBillMutation(bill: Bill): string {
  return `
    mutation {
		  createbill (bill: { ${billInputQuery(bill)} }) {
        ${billResponseQuery()}
		  }
	  }`
}

export function updateBillMutation(bill: Bill): string {
  return `
    mutation {
		  updatebill (bill: { ${billInputQuery(bill, true)} }) {
		    ${billResponseQuery()}
		  }
	  }`
}

export function billResponseQuery(): string {
  return 'id, account {id, name}, paid, paid_result, outstanding, period_start_at, period_end_at, available_at, created_at, updated_at, detail {amount, description, created_at}'
}

export function billInputQuery(bill: Bill, includeId?: boolean): string {
  const details = bill.detail.reduce((a, b) => `${a ? ',': ''} {created_at: "${b.createdAt.clone().format()}", description: "${b.description}", amount: ${b.amount.amount}}`, '');

  return `
      ${addId(bill.id, includeId)},
      account: "${bill.account.id}",
      detail: [${details}],
      paid: ${!!bill.paid},
      period_end_at: "${bill.periodEnd.clone().format()}",
      period_start_at: "${bill.periodStart.clone().format()}",
      available_at: "${bill.availableAt.clone().format()}",
    `
}
