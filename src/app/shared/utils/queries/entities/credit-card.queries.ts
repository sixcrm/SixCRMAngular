import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {CreditCard} from '../../../models/credit-card.model';
import {getStateCodes, stateCode, countryCode} from '../../address.utils';

export function creditCardsListQuery(limit?:number, cursor?:string, search?: string): string {
  return `{
    creditcardlist ${listQueryParams(limit, cursor, search)}{
			creditcards {
			  ${creditCardResponseQuery()}
			}
		  ${fullPaginationStringResponseQuery()}
		}}`
}

export function creditCardQuery(id: string): string {
  return `{
    creditcard (id: "${id}") { 
	    ${creditCardResponseQuery()}
    }
  }`
}

export function deleteCreditCardMutation(id: string): string {
  return deleteMutationQuery('creditcard', id);
}

export function deleteCreditCardsMutation(id: string[]): string {
  return deleteManyMutationQuery('creditcard', id);
}

export function createCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  createcreditcard (creditcard: { ${creditCardInputQuery(cc)} }) {
        ${creditCardResponseQuery()}
      }
	  }`
}

export function updateCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  updatecreditcard (creditcard: { ${creditCardInputQuery(cc, true)} }) {
        ${creditCardResponseQuery()}
      }
	  }`
}

export function creditCardResponseQuery(): string {
  return `id number expiration ccv name address { line1 line2 city state zip country } customers {id, firstname, lastname, address {city, state, zip}}`;
}

export function creditCardInputQuery(cc: CreditCard, includeId?: boolean): string {
  let expiration = cc.expiration ? `expiration:"${cc.expiration}"` : '';
  let line1 = cc.address.line1 ? `line1:"${cc.address.line1}"` : '';
  let line2 = cc.address.line2 ? `line2:"${cc.address.line2}"` : '';
  let city = cc.address.city ? `city:"${cc.address.city}"` : '';
  let state = cc.address.state ? `state:"${stateCode(cc.address.state)}"` : '';
  let zip = cc.address.zip ? `zip:"${cc.address.zip}"` : '';
  let country = cc.address.country ? `country:"${countryCode(cc.address.country)}"` : '';

  return `${addId(cc.id, includeId)} number: "${cc.ccnumber}" ${expiration} ccv: "${cc.ccv}" name: "${cc.name}" address: { ${line1} ${line2} ${city} ${state} ${zip} ${country} }`
}
