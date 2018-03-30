import {UserSettings} from '../../../models/user-settings';

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

  let updateString = `id: "${userSettings.id}", updated_at:"${userSettings.updatedAtAPI}", ${wphone} ${cphone} ${tzone} ${preferences} ${notificationString} ${language}`;

  return `
    mutation {
      updateusersetting (usersetting: { ${updateString} }) {
        id work_phone cell_phone timezone language created_at updated_at column_preferences,
        notifications { name receive data }
      }
	  }
  `
}
