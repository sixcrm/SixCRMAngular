import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Notification, compareNotifications} from '../../shared/models/notification.model';
import {NotificationsService} from '../../shared/services/notifications.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {utc} from 'moment';
import {EntitiesByDate} from '../../shared/models/entities-by-date.interface';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends AbstractEntityIndexComponent<Notification> implements OnInit, OnDestroy {

  private loading: boolean;
  isEmpty: boolean = false;

  notsByDate: EntitiesByDate<Notification>[] = [
    {label: 'Today', entities: [], contains: (n: Notification) => utc(n.createdAt).isSame(utc(), 'day')},
    {label: 'Last 7 days', entities: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(7, 'd'))},
    {label: 'Last 30 days', entities: [], contains: (n: Notification) => utc(n.createdAt).isAfter(utc().subtract(30, 'd'))},
    {label: 'Other', entities: [], contains: (n: Notification) => true}
  ];

  constructor(
    public notificationsService: NotificationsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService
  ) {
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
      if (notification instanceof CustomServerError) return;

      this.updateLocally(notification)
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

      if (this.notsByDate[i].entities.length > 0) {
        empty = false;
      }
    }

    this.isEmpty = empty;
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
}
