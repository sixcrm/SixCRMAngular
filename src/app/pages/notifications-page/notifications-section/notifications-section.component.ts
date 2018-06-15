import {Component, OnInit, OnDestroy} from '@angular/core';
import {Notification} from '../../../shared/models/notification.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {NotificationsService} from '../../../entity-services/services/notifications.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Router} from '@angular/router';
import {NotificationsQuickService} from '../../../entity-services/services/notifications-quick.service';
import {MatDialog} from '@angular/material';

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

  notificationType: string = null;

  constructor(
    public notificationsService: NotificationsService,
    router: Router,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    private notificationsQuickService: NotificationsQuickService
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

    this.notificationsService.entityUpdated$
      .merge(this.notificationsQuickService.entityUpdated$)
      .subscribe(notification => {
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
      notification.markAsRead();
      this.notificationsService.updateEntity(notification, {ignoreSnack: true});
    }
  }

  showAll() {
    this.notificationType = null;
  }

  showAlerts() {
    this.notificationType = 'alert';
  }

  showNotifications() {
    this.notificationType = 'notification';
  }

  markAllAsRead() {
    this.notificationsService.updateEntities(this.notifications.filter(n => !n.readAt).map(n => n.markAsRead()));
  }

  markAsUnread(notification: Notification) {
    this.notificationsService.updateEntity(notification.markAsUnread());
  }

  goToLink(notification: Notification) {
    this.router.navigateByUrl(notification.contextLink());
  }

}
