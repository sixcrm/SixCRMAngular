import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {Customer} from '../../../models/customer.model';
import {stateCode, countryCode} from '../../address.utils';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function customersInfoListQuery(params: IndexQueryParameters): string {
  return `{
    customerlist ${listQueryParams(params)} {
      customers {
        ${customerInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function customerQuery(id: string): string {
  return `{
    customer (id: "${id}") {
      ${customerResponseQuery()}
		}
  }`
}

export function deleteCustomerMutation(id: string): string {
  return deleteMutationQuery('customer', id);
}

export function deleteCustomersMutation(id: string[]): string {
  return deleteManyMutationQuery('customer', id);
}

export function createCustomerMutation(customer: Customer): string {
  return `
    mutation {
		  createcustomer (customer: { ${customerInputQuery(customer)} }) {
        ${customerResponseQuery()}
		  }
	  }`
}

export function updateCustomerMutation(customer: Customer): string {
  return `
    mutation {
		  updatecustomer (customer: { ${customerInputQuery(customer, true)} }) {
		    ${customerResponseQuery()}
		  }
	  }`
}

export function customerInfoResponseQuery(): string {
  return 'id firstname lastname email phone created_at updated_at address { city country state zip line1 }'
}

export function customerResponseQuery(): string {
  return `
    id email firstname lastname phone created_at updated_at default_creditcard,
    address { line1 line2 city state zip country }
    creditcards { id name expiration last_four first_six type created_at,
      address { line1 line2 city state zip country }
    }`
}

export function customerInputQuery(customer: Customer, includeId?: boolean): string {
  let creditCards = customer.creditCards.map(c => c.id).reduce((a,b) => `${a} "${b}",`, '');

  return `
      ${addId(customer.id, includeId)},
      email: "${customer.email}",
      firstname: "${customer.firstName}",
      lastname: "${customer.lastName}",
      phone: "${customer.phone}",
      creditcards:[${creditCards}],
      ${customer.defaultCreditCard ? `default_creditcard: "${customer.defaultCreditCard}",` : ''}
      address: {
        ${customer.address.line1 ? `line1:"${customer.address.line1}"` : ''}
        ${customer.address.line2 ? `line2:"${customer.address.line2}"` : ''}
        ${customer.address.city ? `city:"${customer.address.city}"` : ''}
        ${customer.address.state ? `state:"${stateCode(customer.address.state)}"` : ''}
        ${customer.address.zip ? `zip:"${customer.address.zip}"` : ''}
        ${customer.address.country ? `country:"${countryCode(customer.address.country)}"` : ''}
      }, 
      ${addUpdatedAtApi(customer, includeId)}
    `
}
