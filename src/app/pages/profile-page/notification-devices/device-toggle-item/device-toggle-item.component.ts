import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {NotificationUserSettings} from '../../../../shared/models/user-settings';
import {isValidEmail} from "../../../../shared/utils/form.utils";

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

  originalValue;

  deviceLabels = {
    six: 'SixCRM',
    ios: 'iOS App',
    email: 'E-Mail',
    sms: 'SMS Phone',
    skype: 'Skype',
    slack: 'Slack'
  };

  validationFunctions = {
    email: (email: string) => this.validEmail(email),
    sms: (phone: string) => this.validPhone(phone),
    slack: (slackWebHook: string) => this.validSlackWebHook(slackWebHook),
    skype: () => {}
  };

  deviceNoDataLabels = {
    email: 'Add E-Mail',
    sms: 'Add phone number',
    skype: 'Add Skype web hook',
    slack: 'Add Slack web hook',
    ios: 'App not registered',
  };

  formInvalid: boolean;

  constructor() { }

  ngOnInit() {
    this.originalValue = this.notificationSettings.data;
  }

  keyup(event) {
    if (event.keyCode === 13) { // Enter
      this.updateData();
    }

    if (event.keyCode === 27) { //Esc
      this.valueInput.nativeElement.value = this.originalValue;
      this.updateData();
    }
  }

  updateData() {
    if (this.notificationSettings.data === this.valueInput.nativeElement.value) {
      this.editMode = false;
      return;
    }

    if (this.validationFunctions[this.notificationSettings.name](this.valueInput.nativeElement.value) ||
        !this.valueInput.nativeElement.value) {
      this.notificationSettings.data = this.valueInput.nativeElement.value;
      this.editMode = false;

      this.toggled.emit(true);
      this.formInvalid = false
      this.originalValue = this.notificationSettings.data;
    } else {
      this.formInvalid = true;
    }
  }

  validEmail(email: string): boolean {
    return isValidEmail(email);
  }

  validSlackWebHook(slackWebHook: string): boolean {
    let regex = /^https?:\/\/(hooks\.slack\.com\/services\/){1}[-a-zA-Z0-9]{9}\/[-a-zA-Z0-9]{9}\/[-a-zA-Z0-9]{24}$/;
    return regex.test(slackWebHook);
  }

  validPhone(phone: string): boolean {
    let regex = /^\+?[0-9-/()\s]*$/;

    let open_brackets = (phone.match(/\(/g) || []).length;
    let closed_brackets = (phone.match(/\)/g) || []).length;

    let open_bracket_position = phone.indexOf("(");
    let closed_bracket_position = phone.indexOf(")");

    if ((open_brackets > 1) ||
        (closed_brackets > 1) ||
        (open_brackets !== closed_brackets) ||
        (open_bracket_position > closed_bracket_position) ||
        phone.length < 6)
    return false;

    return regex.test(phone);
  }
}
