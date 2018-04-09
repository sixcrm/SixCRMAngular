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
import {Router} from '@angular/router';

@Component({
  selector: 'notifications-section',
  templateUrl: './notifications-section.component.html',
  styleUrls: ['./notifications-section.component.scss']
})
export class NotificationsSectionComponent extends AbstractEntityIndexComponent<Notification> implements OnInit, OnDestroy {

  notifications: Notification[] = [];

  loading: boolean;
  isEmpty: boolean = false;

  selectedIndex: number = 0;

  filter: string;
  filterMapper = (notification: Notification) => `${notification.body}`;

  constructor(
    public notificationsService: NotificationsService,
    router: Router,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService
  ) {
    super(notificationsService, auth, dialog, paginationService, router);
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
      this.notifications = this.notifications.concat(entities).sort((a,b) => {
        if (a.createdAt.isBefore(b.createdAt)) return 1;
        if (b.createdAt.isBefore(a.createdAt)) return -1;
        return 0;
      });
    });

    this.notificationsService.requestInProgress$.takeUntil(this.unsubscribe$).subscribe(loading => this.loading = loading);

    this.notificationsService.entityUpdated$.subscribe(notification => {
      if (notification instanceof CustomServerError) return;

      for (let i = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].id === notification.id) {
          this.notifications[i] = notification;
        }
      }
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
    if (!notification.readAt) {
      this.notificationsService.updateEntity(notification, {ignoreSnack: true});
    }

    if (notification.category && notification.context[`${notification.category}.id`]) {
      this.router.navigate([notification.category + 's', notification.context[`${notification.category}.id`]]);
    }
  }
}
