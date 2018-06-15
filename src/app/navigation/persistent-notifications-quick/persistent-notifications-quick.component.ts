import {Component, OnInit, OnDestroy} from '@angular/core';
import {Notification} from '../../shared/models/notification.model';
import {NotificationsQuickService} from '../../entity-services/services/notifications-quick.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subscription, Subject} from 'rxjs';
import {utc} from 'moment';

@Component({
  selector: 'persistent-notifications-quick',
  templateUrl: './persistent-notifications-quick.component.html',
  styleUrls: ['./persistent-notifications-quick.component.scss']
})
export class PersistentNotificationsQuickComponent implements OnInit, OnDestroy {

  persistentNotifications: Notification[] = [];
  persistentNotificationsToShow: Notification[] = [];
  filteredPersistentNotification: Notification;

  sessionSub: Subscription;
  notificationsSub: Subscription;
  aclSub: Subscription;

  notificationsFiltered$: Subject<boolean> = new Subject();

  billingDisabledAlready: boolean;

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
      let predefined = [];

      if (this.authService.isBillingDisabledOrSoonToBeDisabled()) {
        this.billingDisabledAlready = this.isBillingAlreadyDisabled();
        predefined = this.appendBillingDisabledNotification(predefined);
      }

      this.persistentNotifications = notifications;
      this.persistentNotificationsToShow = [...predefined, ...notifications];

      this.filterNotifications();
    });

    this.aclSub = this.authService.activeAcl$.subscribe(() => {
      let predefined = [];

      if (this.authService.isBillingDisabledOrSoonToBeDisabled()) {
        this.billingDisabledAlready = this.isBillingAlreadyDisabled();
        predefined = this.appendBillingDisabledNotification(predefined);
      }

      this.persistentNotificationsToShow = [...predefined, ...this.persistentNotifications];

      this.filterNotifications();
    })
  }

  private appendBillingDisabledNotification(notifications: Notification[]): Notification[] {
    const account = this.authService.getActiveAcl().account;

    if (!account.billing || !account.billing.disable) return notifications.slice();

    const daysTillBilling = (account.billing.disable).diff(utc(), 'd');

    return [...notifications, this.createBillingDisableNotification(daysTillBilling)];
  }

  private isBillingAlreadyDisabled(): boolean {
    const account = this.authService.getActiveAcl().account;

    if (!account.billing || !account.billing.disable) return false;

    return (account.billing.disable).diff(utc(), 'd') >= 0;
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

    const filtered = this.persistentNotificationsToShow.filter(n => hiddenNotifications.indexOf(n.id) === -1);
    this.filteredPersistentNotification = filtered && filtered.length > 0 ? filtered[0] : undefined;

    this.notificationsFiltered$.next(true);
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

  performAction(notification: Notification): void {

  }

}
