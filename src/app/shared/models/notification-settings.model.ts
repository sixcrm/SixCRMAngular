import {utc, Moment} from 'moment';

export class NotificationGroupItem {
  key: string;
  description: string;
  default: boolean;
  name: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.key = obj.key || '';
    this.description = obj.description || '';
    this.default = obj.default || false;
    this.name = obj.name || '';
  }
}

export class NotificationGroup {
  key: string;
  name: string;
  description: string;
  display: boolean;
  notifications: NotificationGroupItem[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.key = obj.key || '';
    this.name = obj.name || '';
    this.description = obj.name || '';
    this.display = obj.display || false;

    if (obj.notifications) {
      obj.notifications.forEach(notification => this.notifications.push(new NotificationGroupItem(notification)));
    }
  }
}

export class NotificationSettingsData {
  notification_groups: NotificationGroup[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    if (obj.notification_groups) {
      obj.notification_groups.forEach(group => this.notification_groups.push(new NotificationGroup(group)));
    }
  }
}

export class NotificationSettings {
  id: string;
  settings: NotificationSettingsData;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.settings = obj.settings ? new NotificationSettingsData(JSON.parse(obj.settings)) : null;
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }
}
