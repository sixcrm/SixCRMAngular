import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';
import {Notification} from '../../shared/models/notification.model';
import {Subscription} from 'rxjs';
import {firstIndexOf} from '../../shared/utils/array.utils';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';

@Component({
  selector: 'alerts-quick',
  templateUrl: './alerts-quick.component.html',
  styleUrls: ['./alerts-quick.component.scss']
})
export class AlertsQuickComponent implements OnInit, OnDestroy {

  alerts: Notification[];
  all: Notification[];
  count: number;

  private sub: Subscription;
  private updateSub: Subscription;

  constructor(private notificationQuickService: NotificationsQuickService) { }

  ngOnInit() {
    this.sub = this.notificationQuickService.alerts$.subscribe(notifications => {
      this.all = notifications;

      this.filterAlerts();
    });

    this.updateSub = this.notificationQuickService.entityUpdated$.subscribe(entity => {
      if (entity instanceof CustomServerError) {
        return;
      }

      let index = firstIndexOf(this.all, el => el.id === entity.id);

      if (index >= 0) {
        this.all.splice(index, 1);

        this.filterAlerts();
      }
    })
  }

  filterAlerts() {
    const unread = this.all.filter(notification => !notification.readAt);
    this.alerts = unread.slice(0,3);
    this.count = unread && unread.length > 3 ? unread.length - 3 : 0;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }

  dismissAlert(notification: Notification) {
    this.notificationQuickService.updateEntity(notification);
  }
}
