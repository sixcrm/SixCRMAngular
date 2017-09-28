import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId
} from './entities-helper.queries';
import {smtpProviderResponseQuery} from './smtp-provider.queries';
import {EmailTemplate} from '../../../models/email-template.model';

export function emailTemplatesListQuery(limit?:number, cursor?:string): string {
  return `{
    emailtemplatelist ${paginationParamsQuery(limit, cursor)} {
			emailtemplates {
			  ${emailTemplateInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function emailTemplateQuery(id: string): string {
  return `
    {
      emailtemplate (id: "${id}") {
			  ${emailTemplateResponseQuery()}
			}
    }`
}

export function deleteEmailTemplateMutation(id: string): string {
  return deleteMutationQuery('emailtemplate', id);
}

export function updateEmailTemplateMutation(emailTemplate: EmailTemplate): string {
  return `mutation {
		updateemailtemplate (emailtemplate: { ${emailTemplateInputQuery(emailTemplate, true)} }) {
			${emailTemplateResponseQuery()}
		}
	}`;
}

export function createEmailTemplateMutation(emailTemplate: EmailTemplate): string {
  return `mutation {
		createemailtemplate (emailtemplate: { ${emailTemplateInputQuery(emailTemplate)} }) {
			${emailTemplateResponseQuery()}
		}
	}`;
}

export function emailTemplateInfoResponseQuery(): string {
  return `id name subject type smtp_provider { name }`
}

export function emailTemplateResponseQuery(): string {
  return `id name subject body type created_at updated_at smtp_provider { ${smtpProviderResponseQuery()} }`
}

export function emailTemplateInputQuery(emailTemplate: EmailTemplate, includeId?: boolean): string {
  let body = '';
  if (emailTemplate.body) {
    body = `body: "${emailTemplate.body.replace(/"/g, '\\"')}",`
  }

  return `${addId(emailTemplate.id, includeId)}, name: "${emailTemplate.name}", subject: "${emailTemplate.subject}", ${body} type: "${emailTemplate.type.toLowerCase()}", smtp_provider:"${emailTemplate.smtpProvider.id}"`;
}
