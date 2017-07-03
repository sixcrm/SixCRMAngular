import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId
} from './entities-helper.queries';
import {SmtpProvider} from '../../../models/smtp-provider.model';

export function smtpProvidersListQuery(limit?:number, cursor?:string): string {
  return `{
    smtpproviderlist ${paginationParamsQuery(limit, cursor)} {
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

export function smtpProviderInputQuery(smtpProvider: SmtpProvider, includeID?: boolean): string {
  return `${addId(smtpProvider.id, includeID)} name: "${smtpProvider.name}", from_name: "${smtpProvider.fromName}", from_email: "${smtpProvider.fromEmail}", hostname: "${smtpProvider.hostname}", username: "${smtpProvider.username}", password: "${smtpProvider.password}", port: ${smtpProvider.port}`;
}

export function smtpProviderResponseQuery(): string {
  return `id name from_name from_email hostname username password port created_at updated_at`
}
