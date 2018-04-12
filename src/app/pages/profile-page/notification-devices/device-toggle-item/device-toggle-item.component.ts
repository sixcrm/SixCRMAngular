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
    sms: 'SMS Phone',
    skype: 'Skype',
    slack: 'Slack'
  };

  deviceNoDataLabels = {
    email: 'Add E-Mail',
    sms: 'Add phone number',
    skype: 'Add Skype web hook',
    slack: 'Add Slack web hook',
    ios: 'App not registered',
  };

  constructor() { }

  ngOnInit() {
  }

  updateData() {
    if (this.notificationSettings.data === this.valueInput.nativeElement.value) {
      this.editMode = false;
      return;
    }

    this.notificationSettings.data = this.valueInput.nativeElement.value;
    this.editMode = false;

    this.toggled.emit(true);
  }
}
