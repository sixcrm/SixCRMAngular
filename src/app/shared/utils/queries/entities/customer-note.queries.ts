import {
  deleteMutationQuery, paginationParamsQuery, fullPaginationStringResponseQuery,
  deleteManyMutationQuery, addId, addUpdatedAtApi
} from './entities-helper.queries';
import {CustomerNote} from '../../../models/customer-note.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function customerNotesByCustomerQuery(id: string, params: IndexQueryParameters): string {
  return `{
    customernotelistbycustomer (customer:"${id}" ${paginationParamsQuery(params, true)}) {
      customernotes {
        ${customerNoteResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
		}}`
}

export function createCustomerNoteMutation(customerNote: CustomerNote): string {
  return `
    mutation {
		  createcustomernote (customernote: { ${customerNoteInputQuery(customerNote)} }) {
		    ${customerNoteResponseQuery()}
		  }
	  }`
}

export function updateCustomerNoteMutation(customerNote: CustomerNote): string {
  return `
    mutation {
		  updatecustomernote (customernote: { ${customerNoteInputQuery(customerNote, true)} }) {
		    ${customerNoteResponseQuery()}
		  }
	  }`
}

export function deleteCustomerNoteMutation(id: string): string {
  return deleteMutationQuery('customernote', id);
}

export function deleteCustomerNotesMutation(id: string[]): string {
  return deleteManyMutationQuery('customernote', id);
}

export function customerNoteResponseQuery(): string {
  return 'id body created_at updated_at user { id name }';
}

export function customerNoteInputQuery(customerNote: CustomerNote, includeId?: boolean): string {
  return `${addId(customerNote.id, includeId)}, customer: "${customerNote.customer.id}" user: "${customerNote.user.id}" body: "${customerNote.body}", ${addUpdatedAtApi(customerNote, includeId)}`;
}
