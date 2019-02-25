import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {SmsProvider} from '../../../models/sms-provider.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function smsProvidersListQuery(params: IndexQueryParameters): string {
  return `{
    smsproviderlist ${listQueryParams(params)} {
			smsproviders {
        ${smsProviderResponseQuery()}
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function smsProviderQuery(id: string): string {
  return `{
    smsprovider (id: "${id}") {
      ${smsProviderResponseQuery()}
    }
  }`
}

export function deleteSmsProviderMutation(id: string): string {
  return deleteMutationQuery('smsprovider', id);
}

export function deleteSmsProvidersMutation(id: string[]): string {
  return deleteManyMutationQuery('smsprovider', id);
}

export function createSmsProviderMutation(smsProvider: SmsProvider): string {
  return `
    mutation {
		  createsmsprovider ( smsprovider: { ${smsProviderInputQuery(smsProvider)} }) {
        ${smsProviderResponseQuery()}
      }
	  }`
}

export function updateSmsProviderMutation(smsProvider: SmsProvider): string {
  return `
    mutation {
		  updatesmsprovider ( smsprovider: { ${smsProviderInputQuery(smsProvider, true)} }) {
        ${smsProviderResponseQuery()}
      }
	  }`
}

export function validateSmsProviderQuery(smsProvider: SmsProvider, phoneNumber: string): string {
  return `
    mutation {
		  smsvalidation ( smsprovider: "${smsProvider.id}", recipient_phone:"${phoneNumber}") {
        sms_response
      }
	  }`
}

export function smsProviderInputQuery(smsProvider: SmsProvider, includeID?: boolean): string {
  return `${addId(smsProvider.id, includeID)} type:"${smsProvider.type}" name: "${smsProvider.name}", api_account: "${smsProvider.apiAccount}", api_token: "${smsProvider.apiToken}", from_number: "${smsProvider.fromNumber}", ${addUpdatedAtApi(smsProvider, includeID)}`;
}

export function smsProviderResponseQuery(): string {
  return `id type name api_account api_token from_number created_at updated_at`
}
