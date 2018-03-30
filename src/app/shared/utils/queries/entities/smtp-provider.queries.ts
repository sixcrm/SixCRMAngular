import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {SmtpProvider} from '../../../models/smtp-provider.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function smtpProvidersListQuery(params: IndexQueryParameters): string {
  return `{
    smtpproviderlist ${listQueryParams(params)} {
			smtpproviders {
        ${smtpProviderResponseQuery()}
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function smtpProviderQuery(id: string): string {
  return `{
    smtpprovider (id: "${id}") {
      ${smtpProviderResponseQuery()}
    }
  }`
}

export function deleteSmptProviderMutation(id: string): string {
  return deleteMutationQuery('smtpprovider', id);
}

export function deleteSmptProvidersMutation(id: string[]): string {
  return deleteManyMutationQuery('smtpprovider', id);
}

export function createSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  createsmtpprovider ( smtpprovider: { ${smtpProviderInputQuery(smtpProvider)} }) {
        ${smtpProviderResponseQuery()}
      }
	  }`
}

export function updateSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  updatesmtpprovider ( smtpprovider: { ${smtpProviderInputQuery(smtpProvider, true)} }) {
        ${smtpProviderResponseQuery()}
      }
	  }`
}

export function validateSmtpProviderQuery(smtpProvider: SmtpProvider, email: string): string {
  return `
  mutation {
    smtpvalidation ( smtpvalidation: { email:"${email}" , smtpprovider:"${smtpProvider.id}" }) {
      send_properties{sender_email,sender_name,subject,body,recepient_emails},
      smtp_response,
      smtpprovider {id,name,hostname,username,password,from_email,from_name,port,created_at,updated_at}
    }
  }`
}

export function smtpProviderInputQuery(smtpProvider: SmtpProvider, includeID?: boolean): string {
  return `${addId(smtpProvider.id, includeID)} name: "${smtpProvider.name}", from_name: "${smtpProvider.fromName}", from_email: "${smtpProvider.fromEmail}", hostname: "${smtpProvider.hostname}", username: "${smtpProvider.username}", password: "${smtpProvider.password}", port: ${smtpProvider.port}, ${addUpdatedAtApi(smtpProvider, includeID)}`;
}

export function smtpProviderResponseQuery(): string {
  return `id name from_name from_email hostname username password port created_at updated_at`
}
