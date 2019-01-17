import {utc, Moment} from 'moment';
import {ColumnParams} from './column-params.model';
import * as moment from 'moment-timezone';

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
  columnPreferences: string[] = [];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.workPhone = obj.work_phone || '';
    this.cellPhone = obj.cell_phone || '';
    this.timezone = obj.timezone || '';
    this.language = obj.language || 'English';

    if (obj.column_preferences) {
      this.columnPreferences = obj.column_preferences;
    }

    if (obj.notifications) {
      obj.notifications.forEach(notification => this.notificationSettings.push(new NotificationUserSettings(notification)));
    }

    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  updatePreferencesByColumnParams(columnParams: ColumnParams<any>[]) {
    let temp = this.columnPreferences.filter(el => {
      return !columnParams.find(params => params.label === el);
    });

    columnParams.forEach(params => {
      if (params.selected) {
        temp.push(params.label);
      }
    });

    this.columnPreferences = temp.slice();
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
      column_preferences: this.columnPreferences,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI,
    }
  }
}
