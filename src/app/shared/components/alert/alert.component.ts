import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Notification} from '../../models/notification.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {TimeService} from '../../services/time.service';

@Component({
  selector: 'alert-component',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alert: Notification;
  @Input() enableClear: boolean = true;
  @Input() enableView: boolean = true;
  @Output() clear: EventEmitter<Notification> = new EventEmitter();
  @Output() view: EventEmitter<Notification> = new EventEmitter();

  constructor(public authService: AuthenticationService, private timeService: TimeService) { }

  ngOnInit() { }

  viewAlert(): void {
    this.view.emit(this.alert);
  }

  clearAlert(): void {
    this.clear.emit(this.alert);
  }

  calculateTime(): string {
    if (!this.alert || !this.alert.createdAt) return '';

    return this.timeService.format(this.alert.createdAt, 'date-time', true, true);
  }

}
