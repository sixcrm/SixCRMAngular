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
  return 'id, company_logo, support_link, support_phone, support_email, emailtemplatesettings { custom_blocks {id, title, body}, color_primary, color_secondary, color_tertiary }, created_at, updated_at';
}

export function accountDetailsInputQuery(details: AccountDetails): string {
  let settings = `${details.emailTemplateSettings.colorPrimary ? `color_primary: "${details.emailTemplateSettings.colorPrimary}", ` : ''}${details.emailTemplateSettings.colorSecondary ? `color_secondary: "${details.emailTemplateSettings.colorSecondary}", ` : ''}${details.emailTemplateSettings.colorTertiary ? `color_tertiary: "${details.emailTemplateSettings.colorTertiary}", ` : ''}custom_blocks: [${details.emailTemplateSettings.customBlocks.reduce((a,b)=>`${a}${a?',':''}{id:"${b.id}", title:"${b.title}", body:"${clean(b.body)}"}`,'')}]`;

  return `id:"${details.id}" ${details.companyLogo ? `, company_logo: "${details.companyLogo}"` : ''} ${details.supportLink ? `, support_link: "${details.supportLink}"` : ''} ${details.supportPhone ? `, support_phone: "${details.supportPhone}"` : ''} ${details.supportEmail ? `, support_email: "${details.supportEmail}"` : ''}, emailtemplatesettings: {${settings}}, updated_at:"${details.updatedAt.format()}"`;
}
