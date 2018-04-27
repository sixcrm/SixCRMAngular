import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotificationsSectionComponent} from "./notifications-section/notifications-section.component";

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  @ViewChild('notifications') notificationsComponent: NotificationsSectionComponent;

  constructor() { }

  ngOnInit() {
  }

  numberOfUnreadNotifications() {
    if (!this.notificationsComponent || !this.notificationsComponent.notifications) {
      return '';
    }

    return this.notificationsComponent.notifications.filter(n => !n.readAt).length;
  }

  ngOnDestroy() {
  }
}
