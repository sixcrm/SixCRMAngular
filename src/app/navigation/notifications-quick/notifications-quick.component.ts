import {Component, Output, EventEmitter, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {Notification} from '../../shared/models/notification.model';
import {utc} from 'moment';
import {Router} from '@angular/router';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';
import {EntitiesByDate} from '../../shared/models/entities-by-date.interface';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {arrangeNotificationsByDate, isEmpty, updateLocally} from '../../shared/utils/notification.utils';
import {firstIndexOf} from '../../shared/utils/array.utils';

@Component({
  selector: 'notifications-quick',
  templateUrl: './notifications-quick.component.html',
  styleUrls: ['./notifications-quick.component.scss'],
  host: {'(document:click)':'onClick($event)'}
})
export class NotificationsQuickComponent implements OnInit, OnDestroy {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  notsByDate: EntitiesByDate<Notification>[] = [
    {label: 'Today', entities: [], contains: (n: Notification) => utc(n.createdAt).isSame(utc(), 'day')},
    {label: 'Last 7 days', entities: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(7, 'd'))},
    {label: 'Last 30 days', entities: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(30, 'd'))},
    {label: 'Other', entities: [], contains: (n: Notification) => true}
  ];

  isEmpty: boolean = false;
  serverError: CustomServerError;
  alerts: Notification[] = [];

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

    this.notificationsService.getEntities(20);
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

  closeNotifications(): void {
    this.close.emit(true);
  }

  arrangeNotifications(nots: Notification[]): void {
    this.alerts = nots.filter(n => n.type === 'alert' && !n.readAt);
    this.notsByDate = arrangeNotificationsByDate(nots.filter(n => n.type !== 'alert' || n.readAt), this.notsByDate);
    this.isEmpty = isEmpty(this.notsByDate);
  }

  readNotification(notification: Notification): void {
    if (notification.readAt) return;

    this.notificationsService.updateEntity(notification);

    if (notification.action && notification.action.indexOf('customer') !== -1) {
      this.router.navigateByUrl(notification.action);
    }
  }

  onClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target) // close notifications sidebar if clicked outside
        && (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__notifications__icon material-icons') // and not clicked on notifications icon
        && (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__notifications__count') // and not clicked on notifications count icon
        && (!event.target.attributes.class || event.target.attributes.class.value !== 'cdk-overlay-backdrop') // and not clicked on material menu overlay
    ) {
      this.close.emit(true);
    }
  }

  navigateAllNotifications(): void {
    this.router.navigateByUrl('/notifications');
    this.close.emit(true);
  }

}
