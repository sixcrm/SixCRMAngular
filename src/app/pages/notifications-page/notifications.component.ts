import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Notification, compareNotifications} from '../../shared/models/notification.model';
import {NotificationsService} from '../../shared/services/notifications.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {utc} from 'moment';
import {NotificationsByDate} from '../../shared/models/notifications-by-date.interface';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends AbstractEntityIndexComponent<Notification> implements OnInit, OnDestroy {

  private loading: boolean;

  notsByDate: NotificationsByDate[] = [
    {label: 'Today', nots: [], contains: (n: Notification) => utc(n.createdAt).isSame(utc(), 'day')},
    {label: 'Last 7 days', nots: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(7, 'd'))},
    {label: 'Last 30 days', nots: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(30, 'd'))},
    {label: 'Other', nots: [], contains: (n: Notification) => true}
  ];

  constructor(
    public notificationsService: NotificationsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(notificationsService, auth, dialog, progressBarService, paginationService);
    this.setInfiniteScroll(true);
  }

  ngOnInit() {
    this.limit = 20;

    this.service.entities$.takeUntil(this.unsubscribe$).subscribe((entities: Notification[]) => {
      this.arrangeNotifications(entities);
      this.progressBarService.hideTopProgressBar();
    });

    this.notificationsService.requestInProgress$.takeUntil(this.unsubscribe$).subscribe(loading => this.loading = loading);

    this.notificationsService.entityUpdated$.subscribe(notification => this.updateLocally(notification));

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

  arrangeNotifications(nots: Notification[]): void {
    nots.forEach(notification => {
      for (let i in this.notsByDate) {
        if (this.notsByDate[i].contains(notification)) {
          this.notsByDate[i].nots.push(notification);

          return;
        }
      }
    });

    for (let i in this.notsByDate) {
      this.notsByDate[i].nots = this.notsByDate[i].nots.sort(compareNotifications);
    }
  }

  updateLocally(notification: Notification): void {
    for (let i in this.notsByDate) {
      for (let j in this.notsByDate[i].nots) {

        if (this.notsByDate[i].nots[j].id === notification.id) {
          this.notsByDate[i].nots[j] = notification;

          return;
        }
      }
    }
  }
}
