import {utc, Moment} from 'moment';

export class NotificationUserSettings {
  name: string;
  receive: boolean;
  data: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.name = obj.name || '';
    this.receive = obj.receive || false;
    this.data = obj.data || '';
  }

  inverse(): any {
    return  {
      name: this.name,
      receive: this.receive,
      data: this.data
    }
  }
}

export class UserSettings {
  id: string;
  workPhone: string;
  cellPhone: string;
  timezone: string;
  language: string;
  notificationSettings: NotificationUserSettings[] = [];
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.workPhone = obj.work_phone || '';
    this.cellPhone = obj.cell_phone || '';
    this.timezone = obj.timezone || '';
    this.language = obj.language || '';

    if (obj.notifications) {
      obj.notifications.forEach(notification => this.notificationSettings.push(new NotificationUserSettings(notification)));
    }

    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): UserSettings {
    return new UserSettings(this.inverse());
  }

  inverse(): any {
    let notifications = [];
    this.notificationSettings.forEach(notification => notifications.push(notification.inverse()));

    return {
      id: this.id,
      work_phone: this.workPhone,
      cell_phone: this.cellPhone,
      timezone: this.timezone,
      language: this.language,
      notifications: notifications,
      created_at: this.createdAt.format(),
      updated_at: this.createdAt.format(),
    }
  }
}
