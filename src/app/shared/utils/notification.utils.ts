import {EntitiesByDate} from '../models/entities-by-date.interface';
import {compareNotifications, Notification} from '../models/notification.model';

export function arrangeNotificationsByDate(nots: Notification[], notsByDate: EntitiesByDate<Notification>[]): EntitiesByDate<Notification>[] {

  nots.forEach(notification => {
    for (let i in notsByDate) {
      if (notsByDate[i].contains(notification)) {
        notsByDate[i].entities.push(notification);

        return;
      }
    }
  });

  for (let i in notsByDate) {
    notsByDate[i].entities = notsByDate[i].entities.sort(compareNotifications);
  }

  return notsByDate;
}

export function isEmpty(notsByDate: EntitiesByDate<Notification>[]): boolean {
  for (let i in notsByDate) {
    if (notsByDate[i].entities.length > 0) {
      return false;
    }
  }

  return true;
}

export function updateLocally(notification: Notification, notsByDate: EntitiesByDate<Notification>[]): EntitiesByDate<Notification>[] {
  for (let i in notsByDate) {
    for (let j in notsByDate[i].entities) {

      if (notsByDate[i].entities[j].id === notification.id) {
        notsByDate[i].entities[j] = notification;

        return notsByDate;
      }
    }
  }

  return arrangeNotificationsByDate([notification], notsByDate);
}
