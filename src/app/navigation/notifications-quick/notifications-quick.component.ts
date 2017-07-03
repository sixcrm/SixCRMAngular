import {Component, Output, EventEmitter, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {Notification, compareNotifications} from '../../shared/models/notification.model';
import {utc} from 'moment';
import {Router} from '@angular/router';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';
import {EntitiesByDate} from '../../shared/models/entities-by-date.interface';
import {AsyncSubject} from 'rxjs';

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

  private unsubscribe: AsyncSubject<boolean> = new AsyncSubject();

  constructor(
    private notificationsService: NotificationsQuickService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.notificationsService.entities$.takeUntil(this.unsubscribe).subscribe(notifications => {
      this.arrangeNotifications(notifications);
      this.notificationsService.restartPoolingNotifications();
    });

    this.notificationsService.entityUpdated$.takeUntil(this.unsubscribe).subscribe(notification => {
      this.updateLocally(notification);
    });

    this.notificationsService.getEntities(20);
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  closeNotifications(): void {
    this.close.emit(true);
  }

  arrangeNotifications(nots: Notification[]): void {
    nots.forEach(notification => {
      for (let i in this.notsByDate) {
        if (this.notsByDate[i].contains(notification)) {
          this.notsByDate[i].entities.push(notification);

          return;
        }
      }
    });

    let empty: boolean = true;
    for (let i in this.notsByDate) {
      this.notsByDate[i].entities = this.notsByDate[i].entities.sort(compareNotifications);
      if (this.notsByDate[i].entities.length !== 0) {
        empty = false;
      }
    }

    this.isEmpty = empty;
  }

  readNotification(notification: Notification): void {
    this.notificationsService.updateEntity(notification);

    if (notification.action && notification.action.indexOf('customer') !== -1) {
      this.router.navigateByUrl(notification.action);
    }
  }

  updateLocally(notification: Notification): void {
    for (let i in this.notsByDate) {
      for (let j in this.notsByDate[i].entities) {

        if (this.notsByDate[i].entities[j].id === notification.id) {
          this.notsByDate[i].entities[j] = notification;

          return;
        }
      }
    }
  }

  onClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target) // close notifications sidebar if clicked outside
        && (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__notifications__icon material-icons') // and not clicked on notifications icon
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
