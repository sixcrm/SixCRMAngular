import {Component, OnInit, Input} from '@angular/core';
import {NotificationSettings} from '../../../shared/models/notification-settings.model';

@Component({
  selector: 'notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.scss']
})
export class NotificationPreferencesComponent implements OnInit {

  @Input() notificationSettings: NotificationSettings;

  constructor() { }

  ngOnInit() {
  }

}
