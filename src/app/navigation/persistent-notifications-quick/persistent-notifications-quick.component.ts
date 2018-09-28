import {Component, OnInit, OnDestroy} from '@angular/core';
import {Notification} from '../../shared/models/notification.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subscription} from 'rxjs';
import {utc} from 'moment';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';

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
  aclSub: Subscription;

  billingNotification: Notification;

  constructor(private notificationsService: NotificationsQuickService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.sessionSub = this.authService.newSessionStarted$.subscribe(started => {
      if (started) {
        this.notificationsService.removeHiddenNotificationsIDs();
      }
    });

    this.notificationsSub = this.notificationsService.notificationsPersistent$.subscribe(notifications => {
      this.persistentNotifications = notifications;

      this.filterNotifications();
    });

    this.aclSub = this.authService.activeAcl$.subscribe((acl) => {
      if (!acl || !acl.id) return;

      this.updateBillingNotification();

      this.persistentNotifications = [];
      this.notificationsService.getPersistentNotifications();
    })
  }

  private updateBillingNotification() {
    if (this.authService.isBillingDisabledOrSoonToBeDisabled()) {
      const account = this.authService.getActiveAcl().account;

      if (!account.billing || !account.billing.disable) {
        this.billingNotification = undefined;
      } else {
        const daysTillBilling = (account.billing.disable).diff(utc(), 'd');

        this.billingNotification = this.createBillingDisableNotification(daysTillBilling);
      }
    }
  }

  private createBillingDisableNotification(numberOfDays): Notification {
    let key = 'billing_disable_soon';

    if (numberOfDays === 0) {
      key = 'billing_disable_today'
    }
    if (numberOfDays > 0) {
      key = 'billing_disable_soon'
    }
    if (numberOfDays < 0) {
      key = 'billing_disabled'
    }

    return this.notificationsService.buildNotificationWithBody({
      name: key,
      category: 'billing',
      context: {days: numberOfDays}
    });
  }

  hideNotification(notification: Notification): void {
    const notifications = this.notificationsService.getHiddenNotificationIDs();

    notifications.push(notification.id);

    this.notificationsService.setHiddenNotificationsIDs(notifications);
  }

  filterNotifications(): void {
    const hiddenNotifications = this.notificationsService.getHiddenNotificationIDs();

    this.filteredPersistentNotifications = this.persistentNotifications.filter(n => hiddenNotifications.indexOf(n.id) === -1);
  }

  ngOnDestroy() {
    if (this.sessionSub) {
      this.sessionSub.unsubscribe();
    }

    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }

    if (this.aclSub) {
      this.aclSub.unsubscribe();
    }
  }

  dismissPersistent(notification: Notification): void {
    this.hideNotification(notification);

    this.filterNotifications();
  }
}
