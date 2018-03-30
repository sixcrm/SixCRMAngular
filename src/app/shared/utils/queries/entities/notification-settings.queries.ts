import {NotificationSettings} from '../../../models/notification-settings.model';

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
      updatenotificationsetting (notificationsetting: { id: "${notificationSettings.id}", , updated_at:"${notificationSettings.updatedAtAPI}", settings:"${settings}"}) {
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
