import {Component, OnInit, OnDestroy} from '@angular/core';
import {Notification} from '../../shared/models/notification.model';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subscription, Subject} from 'rxjs';

@Component({
  selector: 'persistent-notifications-quick',
  templateUrl: './persistent-notifications-quick.component.html',
  styleUrls: ['./persistent-notifications-quick.component.scss']
})
export class PersistentNotificationsQuickComponent implements OnInit, OnDestroy {

  persistentNotifications: Notification[] = [];
  filteredPersistentNotifications: Notification[] = [];

  sessionSub: Subscription;
  notificationsSub: Subscription;

  notificationsFiltered$: Subject<boolean> = new Subject();

  private hiddenNotifications: string = 'hidden_notifications';

  constructor(private notificationsService: NotificationsQuickService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.notificationsService.getPersistentNotifications();

    this.sessionSub = this.authService.newSessionStarted$.subscribe(started => {
      if (started) {
        localStorage.removeItem(this.hiddenNotifications);
      }
    });

    this.notificationsSub = this.notificationsService.notificationsPersistent$.subscribe(notifications => {
      this.persistentNotifications = notifications;

      this.filterNotifications();
    })
  }

  getHiddenNotificationIDs(): string[] {
    const hidden = localStorage.getItem(this.hiddenNotifications);
    let parsed = [];
    if (hidden) {
      parsed = JSON.parse(hidden).notifications;
    }

    return parsed;
  }

  hideNotification(notification: Notification): void {
    const notifications = this.getHiddenNotificationIDs();

    notifications.push(notification.id);

    localStorage.setItem(this.hiddenNotifications, JSON.stringify({notifications: notifications}));
  }

  filterNotifications(): void {
    const hiddenNotifications = this.getHiddenNotificationIDs();

    this.filteredPersistentNotifications = this.persistentNotifications.filter(n => hiddenNotifications.indexOf(n.id) === -1);

    this.notificationsFiltered$.next(true);
  }

  ngOnDestroy() {
    if (this.sessionSub) {
      this.sessionSub.unsubscribe();
    }

    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }
  }

  dismissPersistent(notification: Notification): void {
    this.hideNotification(notification);

    this.filterNotifications();
  }

}
