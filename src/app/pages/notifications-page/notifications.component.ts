import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Notification} from '../../shared/models/notification.model';
import {NotificationsService} from '../../shared/services/notifications.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {utc} from 'moment';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends AbstractEntityIndexComponent<Notification> implements OnInit, OnDestroy {

  private loading: boolean;

  today: Notification[] = [];
  last7: Notification[] = [];
  month: Notification[] = [];
  other: Notification[] = [];

  notifications: Notification[] = [];

  constructor(
    public notificationsService: NotificationsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(notificationsService, auth, dialog, progressBarService, paginationService, true);
  }

  ngOnInit() {
    this.limit = 20;

    this.service.entities$.takeUntil(this.unsubscribe$).subscribe((entities: Notification[]) => {
      this.notifications = [...this.notifications, ...entities];
      this.arrangeNotifications(this.notifications);
      this.progressBarService.hideTopProgressBar();
    });

    this.notificationsService.requestInProgress$.takeUntil(this.unsubscribe$).subscribe(loading => this.loading = loading);

    this.notificationsService.entityUpdated$.subscribe(notification => {
      this.updateLocally(notification);
    });

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onScroll(): void {
    if (!this.loading) {
      this.notificationsService.getEntities(this.limit);
    }
  }

  readNotification(notification: Notification): void {
    this.notificationsService.updateEntity(notification);
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
}
