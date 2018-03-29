import {
  paginationParamsQuery, fullPaginationStringResponseQuery, addUpdatedAtApi,
  clean
} from './entities-helper.queries';
import {utc} from 'moment';
import {Notification} from '../../../models/notification.model'

export function notificationsListQuery(limit?:number, cursor?:string, search?:string, exclusiveStartKey?: string): string {
  return `{
    notificationlist ${paginationParamsQuery(limit, cursor, false, exclusiveStartKey)} {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function plainNotificationsListQuery(limit?: number, cursor?: string): string {
  return `{
    notificationlistbytypes ( types:["notification"], user: true, ${paginationParamsQuery(limit, cursor, true)} ) {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function alertsListQuery(limit?: number, cursor?: string): string {
  return `{
    notificationlistbytypes ( types:["alert"], user: true ) {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function notificationsPersistentListQuery(): string {
  return `{
    notificationlistbytypes ( types:["persistent"], onlyUnexpired: true, user: true ) {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function notificationsQuickListQuery(limit?:number, cursor?:string): string {
  return `{
    notificationlist ${paginationParamsQuery(limit, null)} {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function notificationCountQuery(): string {
  return `{notificationcount {count}}`
}

export function updateNotificationMutation(notification: Notification): string {
  return `
    mutation {
      updatenotification (notification: { ${notificationInputQuery(notification)} }) {
			  ${notificationsResponseQuery()}
		  }
    }`;
}

export function notificationsResponseQuery(): string {
  return 'id user account type category name context read_at expires_at created_at updated_at';
}

export function notificationInputQuery(notification: Notification): string {
  return `id: "${notification.id}", user: "${notification.user}", account: "${notification.account}", type: "${notification.type}", ${notification.category ? `category: "${notification.category}", ` : ''}, ${notification.context ? `context: "${notification.context}", ` : ''}, name: "${notification.name}", read_at: "${utc().format()}", ${addUpdatedAtApi(notification, true)}`;
}
