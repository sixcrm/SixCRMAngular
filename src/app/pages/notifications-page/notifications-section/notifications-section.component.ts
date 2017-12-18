import {Component, OnInit, OnDestroy} from '@angular/core';
import {Notification} from '../../../shared/models/notification.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {EntitiesByDate} from '../../../shared/models/entities-by-date.interface';
import {utc} from 'moment';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {updateLocally, arrangeNotificationsByDate, isEmpty} from '../../../shared/utils/notification.utils';

@Component({
  selector: 'notifications-section',
  templateUrl: './notifications-section.component.html',
  styleUrls: ['./notifications-section.component.scss']
})
export class NotificationsSectionComponent extends AbstractEntityIndexComponent<Notification> implements OnInit, OnDestroy {

  private loading: boolean;
  isEmpty: boolean = false;

  selectedIndex: number = 0;

  notsByDate: EntitiesByDate<Notification>[] = [
    {label: 'NOTIFICATIONS_TODAY', entities: [], contains: (n: Notification) => utc(n.createdAt).isSame(utc(), 'day')},
    {
      label: 'NOTIFICATIONS_YESTERDAY',
      entities: [],
      contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(1, 'd').hour(0).minute(0).second(0))
    },
    {
      label: 'NOTIFICATIONS_DAYS3',
      entities: [],
      contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(3, 'd').hour(0).minute(0).second(0))
    },
    {
      label: 'NOTIFICATIONS_WEEK',
      entities: [],
      contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(7, 'd').hour(0).minute(0).second(0))
    },
    {label: 'NOTIFICATIONS_OTHER', entities: [], contains: (n: Notification) => true}
  ];

  constructor(public notificationsService: NotificationsService,
              auth: AuthenticationService,
              dialog: MdDialog,
              paginationService: PaginationService) {
    super(notificationsService, auth, dialog, paginationService);
    this.setInfiniteScroll(true);
  }

  ngOnInit() {
    this.shareLimit = false;
    this.limit = 20;

    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(entities => {
      if (entities instanceof CustomServerError) {
        this.serverError = entities;
        this.isEmpty = true;
        return;
      }

      this.serverError = null;
      this.arrangeNotifications(entities);
    });

    this.notificationsService.requestInProgress$.takeUntil(this.unsubscribe$).subscribe(loading => this.loading = loading);

    this.notificationsService.entityUpdated$.subscribe(notification => {
      if (notification instanceof CustomServerError) return;

      updateLocally(notification, this.notsByDate)
    });

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onScroll(): void {
    if (!this.loading && this.hasMore) {
      this.notificationsService.getEntities(this.limit);
    }
  }

  readNotification(notification: Notification): void {
    this.notificationsService.updateEntity(notification);
  }

  arrangeNotifications(nots: Notification[]): void {
    this.notsByDate = arrangeNotificationsByDate(nots, this.notsByDate);
    this.isEmpty = isEmpty(this.notsByDate);
  }
}
