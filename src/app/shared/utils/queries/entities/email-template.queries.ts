import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {smtpProviderResponseQuery} from './smtp-provider.queries';
import {EmailTemplate} from '../../../models/email-template.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function emailTemplatesListQuery(params: IndexQueryParameters): string {
  return `{
    emailtemplatelist ${listQueryParams(params)} {
			emailtemplates {
			  ${emailTemplateInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function emailTemplatesSharedListQuery(params: IndexQueryParameters): string {
  return `{
    sharedemailtemplatelist ${listQueryParams(params)} {
			emailtemplates {
			  ${emailTemplateInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function emailTemplatesListBySmtpProviderQuery(smtpproviderID: string, params: IndexQueryParameters): string {
  return `{
    emailtemplatelistbysmtpprovider (smtpprovider:"${smtpproviderID}", ${paginationParamsQuery(params, true)}) {
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

export function emailTemplateSharedQuery(id: string): string {
  return `
    {
      sharedemailtemplate (id: "${id}") {
			  ${emailTemplateResponseQuery()}
			}
    }`
}

export function deleteEmailTemplateMutation(id: string): string {
  return deleteMutationQuery('emailtemplate', id);
}

export function deleteEmailTemplatesMutation(id: string[]): string {
  return deleteManyMutationQuery('emailtemplate', id);
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

export function sendTestEmailQuery(emailTemplate: EmailTemplate): string {
  return `query {
		emailtemplatetest (id: "${emailTemplate.id}") {
			result
		}
	}`;
}

export function emailTemplateInfoResponseQuery(): string {
  return `id name subject body type smtp_provider { id name } created_at updated_at`
}

export function emailTemplateResponseQuery(): string {
  return `id name subject body type created_at updated_at smtp_provider { ${smtpProviderResponseQuery()} }`
}

export function emailTemplateInputQuery(emailTemplate: EmailTemplate, includeId?: boolean): string {
  let body = '';
  if (emailTemplate.body) {
    body = `body: "${emailTemplate.body.replace(/"/g, '\\"')}",`
  }

  const campaigns = emailTemplate.campaigns.reduce((a,b) => `${a}${a?',':''}"${b.id}"`,'');
  const products = emailTemplate.products.reduce((a,b) => `${a}${a?',':''}"${b.id}"`,'');
  const productSchedules = emailTemplate.productSchedules.reduce((a,b) => `${a}${a?',':''}"${b.id}"`,'');

  return `${addId(emailTemplate.id, includeId)}, name: "${emailTemplate.name}", subject: "${emailTemplate.subject}", ${body} type: "${emailTemplate.type.toLowerCase()}", smtp_provider:"${emailTemplate.smtpProvider.id}", campaigns: [${campaigns}], products: [${products}], product_schedules: [${productSchedules}], ${addUpdatedAtApi(emailTemplate, includeId)}`;
}
