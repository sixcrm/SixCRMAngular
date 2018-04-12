import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NotificationSettings, NotificationGroupItem} from '../../../shared/models/notification-settings.model';

@Component({
  selector: 'notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.scss']
})
export class NotificationPreferencesComponent implements OnInit {

  @Input() notificationSettings: NotificationSettings;

  @Output() save: EventEmitter<boolean> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() sendTestAlert: EventEmitter<boolean> = new EventEmitter();
  @Output() sendTestNotification: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  itemToggled(event: any, item: NotificationGroupItem, channel: string) {
    const checked = event.checked;

    const indexOfChannel = item.channels.indexOf(channel);

    if (checked && indexOfChannel === -1) {
      item.channels.push(channel);
    } else if (!checked && indexOfChannel !== -1) {
      item.channels.splice(indexOfChannel, 1);
    }
  }
}
