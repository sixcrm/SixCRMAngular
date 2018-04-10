import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserSettings, NotificationUserSettings} from '../../../shared/models/user-settings';

@Component({
  selector: 'notification-devices',
  templateUrl: './notification-devices.component.html',
  styleUrls: ['./notification-devices.component.scss']
})
export class NotificationDevicesComponent implements OnInit {

  _settings: UserSettings;

  appNotificationSettingsItem: NotificationUserSettings[] = [];
  devNotificationSettingsItem: NotificationUserSettings[] = [];

  @Input() set settings(settings: UserSettings) {
    if (!settings) return;

    this._settings = settings;

    this.parseNotificationSettingsItems();
  }
  @Output() settingToggled: EventEmitter<boolean> = new EventEmitter();
  @Output() sendTestNotification: EventEmitter<boolean> = new EventEmitter();
  @Output() sendTestAlert: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  parseNotificationSettingsItems() {
    let app = this._settings.notificationSettings.filter(f => f.name === 'six' || f.name === 'ios' || f.name === 'slack' || f.name === 'skype');
    let dev = this._settings.notificationSettings.filter(f => f.name !== 'six' && f.name !== 'ios' && f.name !== 'slack' && f.name !== 'skype');

    this.appNotificationSettingsItem = app;
    this.devNotificationSettingsItem = dev;
  }

}
