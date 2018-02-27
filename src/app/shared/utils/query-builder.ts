import {UserSettings} from '../models/user-settings';
import {NotificationSettings} from '../models/notification-settings.model';

function deleteMutation(entity: string, id: string) {
  return `mutation { delete${entity} (id: "${id}") { id }}`
}

export function updateAccountMutation(account: Account, name: string): string {
  return `
    mutation { 
      updateaccount (account: { id: "${account.id}", name: "${name}", active: true}) { 
        id,
        name,
        active,
        created_at,
        updated_at
      } 
    }`
}

export function userSettingsQuery(id: string): string {
  return `
  {
		usersetting (id: "${id}") {
			id work_phone cell_phone timezone language column_preferences created_at updated_at,
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

  let preferences = '';
  if (userSettings.columnPreferences) {
    preferences = `column_preferences: [${userSettings.columnPreferences.reduce((a,b) => `${a}${a?',':''} "${b}"`, '')}]`
  }

  let wphone = userSettings.workPhone ? `work_phone: "${userSettings.workPhone}"` : '';
  let cphone = userSettings.cellPhone ? `cell_phone: "${userSettings.cellPhone}"` : '';
  let tzone = userSettings.timezone ? `timezone: "${userSettings.timezone}"` : '';
  let language = userSettings.language ? `language: "${userSettings.language}"` : '';

  let updateString = `id: "${userSettings.id}" ${wphone} ${cphone} ${tzone} ${preferences} ${notificationString} ${language}`;

  return `
    mutation {
      updateusersetting (usersetting: { ${updateString} }) {
        id work_phone cell_phone timezone language created_at updated_at column_preferences,
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

export function sendTestAlert(): string {
  return `{ alerttest { result } }`
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

function paginationString(): string {
  return 'pagination { count end_cursor has_next_page last_evaluated }';
}
