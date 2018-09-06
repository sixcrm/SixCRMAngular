import {AccountDetails} from '../../../models/account-details.model';
import {clean} from './entities-helper.queries';

export function accountDetailsQuery(id: string): string {
  return `{
    accountdetails {
      ${accountDetailsResponseQuery()}
    }
  }`
}

export function updateAccountDetailsMutation(accountDetails: AccountDetails): string {
  return `
    mutation {
      updateaccountdetails (accountdetails: { ${accountDetailsInputQuery(accountDetails)} }) {
        ${accountDetailsResponseQuery()}
      }
	  }`
}

export function accountDetailsResponseQuery(): string {
  return 'id, company_logo, support_link, emailtemplatesettings { custom_blocks {id, title, body}, color_primary }, created_at, updated_at';
}

export function accountDetailsInputQuery(details: AccountDetails): string {
  let settings = `color_primary: "${details.emailTemplateSettings.colorPrimary}", custom_blocks: [${details.emailTemplateSettings.customBlocks.reduce((a,b)=>`${a}${a?',':''}{id:"${b.id}", title:"${b.title}", body:"${clean(b.body)}"}`,'')}]`;

  return `id:"${details.id}", company_logo: "${details.companyLogo}", support_link: "${details.supportLink}", emailtemplatesettings: {${settings}}, updated_at:"${details.updatedAt.format()}"`;
}
