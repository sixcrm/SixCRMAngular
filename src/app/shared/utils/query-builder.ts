import {SmtpProvider} from '../models/smtp-provider.model';
import {CreditCard} from '../models/credit-card.model';
import {Notification} from '../models/notification.model';
import {utc} from 'moment'
import {UserSettings} from '../models/user-settings';
import {NotificationSettings} from '../models/notification-settings.model';
import {Rebill} from '../models/rebill.model';
import {EmailTemplate} from '../models/email-template.model';

const uuidV4 = require('uuid/v4');

function deleteMutation(entity: string, id: string) {
  return `mutation { delete${entity} (id: "${id}") { id }}`
}

export function creditCardsListQuery(limit?:number, cursor?:string): string {
  return `{
    creditcardlist ${pageParams(limit, cursor)} {
			creditcards { id number expiration ccv name,
			  address { country state city }
			}
		  ${paginationString()}
		}}`
}

export function creditCardQuery(id: string): string {
  return `{
    creditcard (id: "${id}") { id number expiration ccv name,
		  address { line1 line2 city state zip country }
		} }`
}

export function deleteCreditCardMutation(id: string): string {
  return deleteMutation('creditcard', id);
}

export function createCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  createcreditcard (creditcard: { ${cc.getMutation()} }) {
        id number expiration ccv name,
        address { line1 line2 city state zip country }
      }
	  }`
}

export function updateCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  updatecreditcard (creditcard: { ${cc.getMutation()} }) {
        id number expiration ccv name,
        address { line1 line2 city state zip country }
      }
	  }`
}

export function smtpProvidersListQuery(limit?:number, cursor?:string): string {
  return `{
    smtpproviderlist ${pageParams(limit, cursor)} {
			smtpproviders {
        ${smtpProviderResponseQuery()}
      }
			${paginationString()}
		}}`
}

export function smtpProviderQuery(id: string): string {
  return `
    {
      smtpprovider (id: "${id}") {
        ${smtpProviderResponseQuery()}
      }
    }`
}

export function deleteSmptProviderMutation(id: string): string {
  return deleteMutation('smtpprovider', id);
}

export function createSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  createsmtpprovider ( ${smtpProviderInputQuery(smtpProvider, false)} ) {
        ${smtpProviderResponseQuery()}
      }
	  }`
}

export function updateSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  updatesmtpprovider ( ${smtpProviderInputQuery(smtpProvider, true)} ) {
        ${smtpProviderResponseQuery()}
      }
	  }`
}

function smtpProviderInputQuery(smtpProvider: SmtpProvider, includeID: boolean): string {
  return `smtpprovider: { ${includeID ? `id: "${smtpProvider.id}",` : ''} name: "${smtpProvider.name}", from_name: "${smtpProvider.fromName}", from_email: "${smtpProvider.fromEmail}", hostname: "${smtpProvider.hostname}", username: "${smtpProvider.username}", password: "${smtpProvider.password}", port: ${smtpProvider.port}}`;
}

function smtpProviderResponseQuery(): string {
  return `id name from_name from_email hostname username password port created_at updated_at`
}

export function emailTemplatesListQuery(limit?:number, cursor?:string): string {
  return `{
    emailtemplatelist ${pageParams(limit, cursor)} {
			emailtemplates { id name subject body type created_at updated_at,
			  smtp_provider { ${smtpProviderResponseQuery()} }
			}
			${paginationString()}
		}}`
}

export function emailTemplateQuery(id: string): string {
  return `
    {
      emailtemplate (id: "${id}") { id name subject body type created_at updated_at,
			  smtp_provider { ${smtpProviderResponseQuery()} }
			}
    }`
}

export function deleteEmailTemplateMutation(id: string): string {
  return deleteMutation('emailtemplate', id);
}

export function updateEmailTemplateMutation(emailTemplate: EmailTemplate): string {
  return `mutation { 
		updateemailtemplate (emailtemplate: { id: "${emailTemplate.id}", name: "${emailTemplate.name}", subject: "${emailTemplate.subject}", body: "${emailTemplate.body.replace(/"/g, '\\"')}", type: "${emailTemplate.type.toLowerCase()}", smtp_provider:"${emailTemplate.smtpProvider.id}"}) { 
			id name subject body type created_at updated_at,
			smtp_provider { ${smtpProviderResponseQuery()} },
		} 
	}`;
}

export function createEmailTemplateMutation(emailTemplate: EmailTemplate): string {
  return `mutation { 
		createemailtemplate (emailtemplate: { name: "${emailTemplate.name}", subject: "${emailTemplate.subject}", body: "${emailTemplate.body.replace(/"/g, '\\"')}", type: "${emailTemplate.type.toLowerCase()}", smtp_provider:"${emailTemplate.smtpProvider.id}"}) { 
			id name subject body type created_at updated_at,
			smtp_provider { ${smtpProviderResponseQuery()} },
		} 
	}`;
}

export function accessKeysListQuery(limit?:number, cursor?:string): string {
  return `{
    accesskeylist ${pageParams(limit, cursor)} {
			accesskeys { id access_key secret_key }
			${paginationString()}
		}}`
}

export function accessKeyQuery(id: string): string {
  return `
    {
      accesskey (id: "${id}") { id access_key secret_key }
    }`
}

export function deleteAccessKeyMutation(id: string): string {
  return deleteMutation('accesskey', id);
}

export function rolesListQuery(limit?: number, cursor?: string): string {
  return `{
    rolelist ${pageParams(limit, cursor)} {
			roles { id name active }
			${paginationString()}
		}}`
}

export function notificationsListQuery(limit?:number, cursor?:string): string {
  return `{
    notificationlist ${pageParams(limit, cursor)} {
			notifications { id user account type action title body read_at created_at updated_at }
			${paginationString()}
		}}`
}

export function notificationsQuickListQuery(limit?:number, cursor?:string): string {
  return `{
    notificationlist ${pageParams(limit, null)} {
			notifications { id user account type action title body read_at created_at updated_at }
			${paginationString()}
		}}`
}

export function notificationCountQuery(): string {
  return `{notificationcount {count}}`
}

export function updateNotificationMutation(notification: Notification): string {
  return `
    mutation {
      updatenotification (notification: { id: "${notification.id}", user: "${notification.user}", account: "${notification.account}", type: "${notification.type}", action: "${notification.action}", title: "${notification.title}" body: "${notification.body}", read_at: "${utc().format()}"}) {
			  id user account type action title body read_at created_at updated_at
		  }
    }`;
}

export function userSettingsQuery(id: string): string {
  return `
  {
		usersetting (id: "${id}") {
			id work_phone cell_phone timezone created_at updated_at,
			notifications { name receive data }
		}
	}`
}

export function updateUserSettingsMutation(userSettings: UserSettings): string {
  let notificationString = '';
  userSettings.notificationSettings.forEach(notification => {
    notificationString += `{name: "${notification.name}", receive: ${notification.receive}`;
    notificationString += notification.data ? `, data: "${notification.data}"` : '';
    notificationString += '},'
  });
  if (notificationString) {
    notificationString = `, notifications: [${notificationString}]`;
  }

  let wphone = userSettings.workPhone ? `work_phone: "${userSettings.workPhone}"` : '';
  let cphone = userSettings.cellPhone ? `cell_phone: "${userSettings.cellPhone}"` : '';
  let tzone = userSettings.timezone ? `timezone: "${userSettings.timezone}"` : '';

  let updateString = `id: "${userSettings.id}" ${wphone} ${cphone} ${tzone} ${notificationString}`;

  return `
    mutation {
      updateusersetting (usersetting: { ${updateString} }) {
        id work_phone cell_phone timezone created_at updated_at,
        notifications { name receive data }
      }
	  }
  `
}

export function defaultNotificationSettingsQuery(): string {
  return `
    {
		  notificationsettingdefault {
        notification_groups { key name description display,
          notifications { key name description default }
        }
		  }
	  }`
}

export function notificationSettingsQuery(id: string): string {
  return `{
    notificationsetting (id: "${id}") { id settings created_at updated_at }
  }`
}

export function createNotificationSettingsMutation(notificationSettings: NotificationSettings): string {
  let settings = JSON.stringify(notificationSettings.settings).replace(/"/g, '\\"');

  return `
    mutation {
      createnotificationsetting (notificationsetting: { id: "${notificationSettings.id}", settings:"${settings}"}) {
        id settings created_at updated_at
      }
    }`
}

export function updateNotificationSettingsMutation(notificationSettings: NotificationSettings): string {
  let settings = JSON.stringify(notificationSettings.settings).replace(/"/g, '\\"');

  return `
    mutation {
      updatenotificationsetting (notificationsetting: { id: "${notificationSettings.id}", settings:"${settings}"}) {
        id settings created_at updated_at
      }
    }`
}

export function sendTestNotification(): string {
  return `{ notificationtest { result } }`
}

function pageParams(limit?: number, cursor?: string, noBraces?:boolean): string {
  let lim = !!limit ? `limit: "${limit}"` : '';
  let cur = !!cursor ? `cursor: "${cursor}"` : '';

  let params = `pagination: {${lim} ${cur}}`;
  if (!noBraces) {
    params = `(${params})`;
  }

  return limit || cur ? `${params}` : '';
}

function generateUUID(): string {
  return uuidV4();
}

function paginationString(): string {
  return 'pagination { count end_cursor has_next_page last_evaluated }';
}
