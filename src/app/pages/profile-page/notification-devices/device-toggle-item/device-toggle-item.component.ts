import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NotificationUserSettings} from '../../../../shared/models/user-settings';

@Component({
  selector: 'device-toggle-item',
  templateUrl: './device-toggle-item.component.html',
  styleUrls: ['./device-toggle-item.component.scss']
})
export class DeviceToggleItemComponent implements OnInit {

  @Input() notificationSettings: NotificationUserSettings;
  @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  deviceLabels = {
    six: 'SixCRM',
    ios: 'iOS App',
    email: 'E-Mail',
    sms: 'SMS',
    skype: 'Skype',
    slack: 'Slack'
  };

  constructor() { }

  ngOnInit() {
  }

}
