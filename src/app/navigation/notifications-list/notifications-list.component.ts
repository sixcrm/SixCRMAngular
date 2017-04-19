import {Component, Output, EventEmitter, OnInit, ElementRef} from '@angular/core';
import {NotificationsService} from '../../shared/services/notifications.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Notification} from '../../shared/models/notification.model';
import {utc} from 'moment';
import {Router} from '@angular/router';

@Component({
  selector: 'notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
  host: {'(document:click)':'onClick($event)'}
})
export class NotificationsListComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  today: Notification[] = [];
  last7: Notification[] = [];
  month: Notification[] = [];
  other: Notification[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private progressBarService: ProgressBarService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.notificationsService.entities$.subscribe(notifications => {
      this.arrangeNotifications(notifications);
      this.progressBarService.hideTopProgressBar();
    });

    this.notificationsService.entityUpdated$.subscribe(notification => {
      this.updateLocally(notification);
    });

    setTimeout(() => {
      this.progressBarService.showTopProgressBar();
    }, 1);

    this.notificationsService.getEntities();
    this.notificationsService.restartPoolingNotifications();
  }

  closeNotifications(): void {
    this.close.emit(true);
  }

  arrangeNotifications(nots: Notification[]): void {
    this.today = [];
    this.last7 = [];
    this.month = [];
    this.other = [];

    nots.forEach(notification => {
      let date = utc(notification.createdAt);

      if (date.isSame(utc(), 'day')) {
        this.today.push(notification);
      } else if (date.isAfter(utc().subtract(7, 'day'))) {
        this.last7.push(notification);
      } else if (date.isAfter(utc().subtract(1, 'month'))) {
        this.month.push(notification);
      } else {
        this.other.push(notification);
      }
    })
  }

  readNotification(notification: Notification): void {
    this.notificationsService.updateEntity(notification);

    if (notification.action && notification.action.indexOf('customer') !== -1) {
      this.router.navigateByUrl(notification.action);
    }
  }

  updateLocally(notification: Notification): void {
    for (let i = 0 ; i < this.today.length ; i++) {
      if (this.today[i].id === notification.id) {
        this.today[i] = notification;
        return;
      }
    }

    for (let i = 0 ; i < this.last7.length ; i++) {
      if (this.last7[i].id === notification.id) {
        this.last7[i] = notification;
        return;
      }
    }

    for (let i = 0 ; i < this.month.length ; i++) {
      if (this.month[i].id === notification.id) {
        this.month[i] = notification;
        return;
      }
    }

    for (let i = 0 ; i < this.other.length ; i++) {
      if (this.other[i].id === notification.id) {
        this.other[i] = notification;
        return;
      }
    }
  }

  onClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target) // if clicked outside
        && (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__notifications__icon material-icons') // and not clicked on notifications icon
    ) {
      this.close.emit(true);
    }
  }

}
