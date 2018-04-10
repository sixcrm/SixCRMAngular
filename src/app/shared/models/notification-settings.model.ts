import {utc, Moment} from 'moment';

export class NotificationGroupItem {
  key: string;
  channels: string[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.key = obj.key || '';
    this.channels = obj.channels || [];
  }

  inverse(): any {
    return {
      key: this.key,
      channels: this.channels.slice()
    }
  }
}

export class NotificationGroup {
  key: string;
  def: string[];
  display: boolean;
  notifications: NotificationGroupItem[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.key = obj.key || '';
    this.def = obj.default || '';
    this.display = obj.display || false;

    if (obj.notifications) {
      obj.notifications.forEach(notification => this.notifications.push(new NotificationGroupItem(notification)));
    }
  }

  inverse(): any {
    return {
      key: this.key,
      default: this.def,
      display: this.display,
      notifications: this.notifications.map(n => n.inverse())
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

  inverse(): any {
    return {
      notification_groups: this.notification_groups.map(ng => ng.inverse())
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
    this.settings = new NotificationSettingsData(obj.settings);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  inverse(): any {
    return {
      id: this.id,
      settings: this.settings.inverse(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }

  copy(): NotificationSettings {
    return new NotificationSettings(this.inverse())
  }
}
