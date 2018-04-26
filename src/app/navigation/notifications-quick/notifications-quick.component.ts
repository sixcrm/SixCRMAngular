import {Component, Output, EventEmitter, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {Notification} from '../../shared/models/notification.model';
import {utc} from 'moment';
import {Router} from '@angular/router';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';
import {EntitiesByDate} from '../../shared/models/entities-by-date.interface';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {
  allNotifications, arrangeNotificationsByDate, isEmpty,
  updateLocally
} from '../../shared/utils/notification.utils';
import {firstIndexOf} from '../../shared/utils/array.utils';
import { not } from 'rxjs/util/not';

@Component({
  selector: 'notifications-quick',
  templateUrl: './notifications-quick.component.html',
  styleUrls: ['./notifications-quick.component.scss'],
  host: {'(document:click)':'onClick($event)'}
})
export class NotificationsQuickComponent implements OnInit, OnDestroy {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  notsByDate: EntitiesByDate<Notification>[] = [
    {label: 'NOTIFICATIONS_TODAY', entities: [], contains: (n: Notification) => utc(n.createdAt).isSame(utc(), 'day')},
    {label: 'NOTIFICATIONS_YESTERDAY', entities: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(1, 'd').hours(0).minutes(0).seconds(0))},
    {label: 'NOTIFICATIONS_DAYS3', entities: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(3, 'd').hours(0).minutes(0).seconds(0))},
    {label: 'NOTIFICATIONS_WEEK', entities: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(7, 'd').hours(0).minutes(0).seconds(0))},
    {label: 'NOTIFICATIONS_OTHER', entities: [], contains: (n: Notification) => true}
  ];

  isEmpty: boolean = false;
  serverError: CustomServerError;
  alerts: Notification[] = [];
  loaded: boolean;

  private unsubscribe: AsyncSubject<boolean> = new AsyncSubject();

  constructor(
    private notificationsService: NotificationsQuickService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.notificationsService.entities$.takeUntil(this.unsubscribe).subscribe(notifications => {
      if (notifications instanceof CustomServerError) {
        this.serverError = notifications;
        return;
      }

      this.serverError = null;
      this.arrangeNotifications(notifications);
      this.loaded = true;
      this.notificationsService.restartPoolingNotifications();
    });

    this.notificationsService.entityUpdated$.takeUntil(this.unsubscribe).subscribe(notification => {
      if (notification instanceof CustomServerError) {
        this.serverError = notification;
        return;
      }

      this.serverError = null;

      this.updateAlerts(notification);
      this.notsByDate = updateLocally(notification, this.notsByDate)
    });

    this.notificationsService.getEntities(20, null, {ignoreProgress: true});
  }

  updateAlerts(notification: Notification): void {
    if (notification.type === 'alert' && notification.readAt) {
      let index = firstIndexOf(this.alerts, (el) => el.id === notification.id);

      if (index > -1) {
        this.alerts.splice(index, 1);
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  arrangeNotifications(nots: Notification[]): void {
    this.alerts = nots.filter(n => n.type === 'alert' && !n.readAt);
    this.notsByDate = arrangeNotificationsByDate(nots.filter(n => n.type !== 'alert' || n.readAt), this.notsByDate);
    this.isEmpty = isEmpty(this.notsByDate);
  }

  readNotification(notification: Notification): void {
    if (!notification.readAt) {
      notification.markAsRead();
      this.notificationsService.updateEntity(notification, {ignoreSnack: true, ignoreProgress: true});
    }

    if (notification.category && notification.context[`${notification.category}.id`]) {
      this.router.navigate([notification.category + 's', notification.context[`${notification.category}.id`]]);
    }
  }

  onClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target) // close notifications sidebar if clicked outside
        && (!event.target.attributes.class || event.target.attributes.class.value.indexOf('topnav__notifications__icon') !== 0) // and not clicked on notifications icon
        && (!event.target.attributes.class || event.target.attributes.class.value.indexOf('topnav__notifications__count') !== 0) // and not clicked on notifications count icon
        && (!event.target.attributes.class || event.target.attributes.class.value !== 'cdk-overlay-backdrop') // and not clicked on material menu overlay
        && (!event.target.attributes.class || !event.target.attributes.class.value.includes('notifications-list__content_notification_menu_item_markasunread')) // and not clicked on context menu item
    ) {
      this.close.emit(true);
    }
  }

  navigateAllNotifications(): void {
    this.router.navigateByUrl('/notifications');
    this.close.emit(true);
  }

  navigateToSettings() {
    this.router.navigate(['/profile'], {fragment: 'appsanddevices'});

    this.close.emit(true);
  }

  markAsUnread(notification: Notification) {
    this.notificationsService.updateEntity(notification.markAsUnread());
  }

  goToLink() {}

  copyToClipboard(notification: Notification) {}

  markAllAsRead() {
    let notifications: Notification[] = allNotifications(this.notsByDate);

    this.notificationsService.updateEntities(notifications.map(n => n.markAsRead()));
  }

}
