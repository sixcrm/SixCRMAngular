import {Notification} from './notification.model';

export interface NotificationsByDate {
  label: string;
  nots: Notification[];
  contains: (n: Notification) => boolean;
}
