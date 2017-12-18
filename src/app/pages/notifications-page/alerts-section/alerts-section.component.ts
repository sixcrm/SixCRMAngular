import {Component, OnInit, OnDestroy} from '@angular/core';
import {Notification} from '../../../shared/models/notification.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {EntitiesByDate} from '../../../shared/models/entities-by-date.interface';
import {utc} from 'moment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {updateLocally, arrangeNotificationsByDate, isEmpty} from '../../../shared/utils/notification.utils';
import {AlertsService} from '../../../shared/services/alerts.service';

@Component({
  selector: 'alerts-section',
  templateUrl: './alerts-section.component.html',
  styleUrls: ['./alerts-section.component.scss']
})
export class AlertsSectionComponent extends AbstractEntityIndexComponent<Notification> implements OnInit, OnDestroy {

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

  constructor(public notificationsService: AlertsService,
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
        return;
      }

      this.serverError = null;
      this.arrangeNotifications(entities);
    });

    this.notificationsService.requestInProgress$.takeUntil(this.unsubscribe$).subscribe(loading => this.loading = loading);

    this.notificationsService.entityUpdated$.subscribe(notification => {
      if (notification instanceof CustomServerError) {
        this.isEmpty = true;
        return;
      }

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
