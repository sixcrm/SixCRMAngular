import { paginationParamsQuery, fullPaginationStringResponseQuery, addUpdatedAtApi } from './entities-helper.queries';
import {utc} from 'moment';
import {Notification} from '../../../models/notification.model'
import {IndexQueryParameters} from '../index-query-parameters.model';

export function notificationsListQuery(params: IndexQueryParameters): string {
  return `{
    notificationlist ${paginationParamsQuery(params)} {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function plainNotificationsListQuery(params: IndexQueryParameters): string {
  return `{
    notificationlistbytype ( type:"notification", ${paginationParamsQuery(params, true)} ) {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function alertsListQuery(): string {
  return `{
    notificationlistbytype ( type:"alert" ) {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function notificationsPersistentListQuery(): string {
  return `{
    notificationlistbytype ( type:"persistent" ) {
			notifications {
			  ${notificationsResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function notificationsQuickListQuery(params: IndexQueryParameters): string {
  return `{
    notificationlist ${paginationParamsQuery({limit: params.limit, cursor: null})} {
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

export function updateManyNotificationsMutationQuery(notifications: Notification[]): string {
  const body = notifications.reduce((a,b) => `${a} ${generateRandomString(7)}: updatenotification (notification: { ${notificationInputQuery(b)} }) {${notificationsResponseQuery()}}`, '');

  return `mutation { ${body} }`;
}

export function notificationsResponseQuery(): string {
  return 'id user account type category name context read_at expires_at created_at updated_at';
}

export function notificationInputQueryUpdateRead(notification: Notification): string {
  return `id: "${notification.id}", user: "${notification.user}", account: "${notification.account}", type: "${notification.type}", ${notification.category ? `category: "${notification.category}", ` : ''} ${notification.context ? `context: ${JSON.stringify(notification.context)}, ` : ''} name: "${notification.name}", read_at: "${utc().format()}", ${addUpdatedAtApi(notification, true)}`;
}

export function notificationInputQuery(notification: Notification): string {
  return `id: "${notification.id}", user: "${notification.user}", account: "${notification.account}", type: "${notification.type}", ${notification.category ? `category: "${notification.category}",` : ''} ${notification.context ? `context: ${JSON.stringify(notification.context)}, ` : ''} name: "${notification.name}", read_at: ${notification.readAt ? `"${notification.readAt}"` : null}, ${addUpdatedAtApi(notification, true)}`;
}

function generateRandomString(length) {
  return 'r' + (Math.random()*1e32).toString(36).substr(0, length - 1);
}
