import {
  NotificationSettings, NotificationGroup,
  NotificationGroupItem
} from '../../../models/notification-settings.model';
import {addId, addUpdatedAtApi} from './entities-helper.queries';

export function defaultNotificationSettingsQuery(): string {
  return `
    {
		  notificationsettingdefault {
        notification_groups { key display default,
          notifications { key active channels }
        }
		  }
	  }`
}

export function notificationSettingsQuery(id: string): string {
  return `{
    notificationsetting (id: "${id}") {
      ${notificationSettingsResponse()}
    }
  }`
}

export function createNotificationSettingsMutation(notificationSettings: NotificationSettings): string {
  return `
    mutation {
      createnotificationsetting (notificationsetting: { ${notificationSettingsInputQuery(notificationSettings)} }) {
        ${notificationSettingsResponse()}
      }
    }`
}

export function updateNotificationSettingsMutation(notificationSettings: NotificationSettings): string {
  return `
    mutation {
      updatenotificationsetting (notificationsetting: { ${notificationSettingsInputQuery(notificationSettings, true)} }) {
        ${notificationSettingsResponse()}
      }
    }`
}

export function sendTestNotification(): string {
  return `{ notificationtest { result } }`
}

export function sendTestAlert(): string {
  return `{ alerttest { result } }`
}

export function notificationSettingsInputQuery(notificationSettings: NotificationSettings, includeId?: boolean): string {
  const parseGroupItem = (item: NotificationGroupItem) => {
    return `{key: "${item.key}", active: ${!!item.active}, channels: [${item.channels.reduce((a,b)=>`${a}${a?',':''}"${b}"`,'')}]}`;
  };

  const parseGroup = (group: NotificationGroup) => {
    return `{key: "${group.key}", display: ${!!group.display}, default: [${group.def.reduce((a,b)=>`${a}${a?',':''}"${b}"`,'')}], notifications:[${group.notifications.reduce((a,b)=>`${a}${a?',':''}${parseGroupItem(b)}`,'')}]}`;
  };

  const settings = `settings:{ notification_groups: [ ${notificationSettings.settings.notification_groups.reduce((a,b) => `${a}${a?',':''}${parseGroup(b)}`,'')} ]}`;

  return `id:"${notificationSettings.id}" ${settings} ${addUpdatedAtApi(notificationSettings, includeId)}`;
}


function notificationSettingsResponse(): string {
  return `id settings { notification_groups { key, display, default, notifications { key, active, channels } } } created_at updated_at`;
}
