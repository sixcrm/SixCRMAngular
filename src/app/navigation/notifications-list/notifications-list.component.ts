import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {NotificationsService} from '../../shared/services/notifications.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Notification} from '../../shared/models/notification.model';
import {utc} from 'moment';

@Component({
  selector: 'notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  notifications: Notification[] = [];

  today: Notification[] = [];
  last7: Notification[] = [];
  month: Notification[] = [];
  other: Notification[] = [];

  constructor(private notificationsService: NotificationsService, private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.notificationsService.entities$.subscribe(notifications => {
      this.arrangeNotifications(notifications);
      this.progressBarService.hideTopProgressBar();
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

  formatDate(date: string): string {
    return utc(date).format('MMMM D')
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
