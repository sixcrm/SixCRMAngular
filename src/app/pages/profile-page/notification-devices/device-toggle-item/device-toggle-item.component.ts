import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {NotificationUserSettings} from '../../../../shared/models/user-settings';

@Component({
  selector: 'device-toggle-item',
  templateUrl: './device-toggle-item.component.html',
  styleUrls: ['./device-toggle-item.component.scss']
})
export class DeviceToggleItemComponent implements OnInit {

  @ViewChild('valueInput') valueInput;

  @Input() notificationSettings: NotificationUserSettings;
  @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  editMode: boolean;

  deviceLabels = {
    six: 'SixCRM',
    ios: 'iOS App',
    email: 'E-Mail',
    sms: 'SMS',
    skype: 'Skype',
    slack: 'Slack'
  };

  deviceNoDataLabels = {
    email: 'Enter E-Mail',
    sms: 'Enter phone number',
    skype: 'Enter Skype web hook',
    slack: 'Enter Slack web hook'
  };

  constructor() { }

  ngOnInit() {
  }

  deleteData() {
    this.notificationSettings.data = null;
    this.toggled.emit(true);
  }

  updateData() {
    this.notificationSettings.data = this.valueInput.nativeElement.value;
    this.editMode = false;

    this.toggled.emit(true);
  }
}
