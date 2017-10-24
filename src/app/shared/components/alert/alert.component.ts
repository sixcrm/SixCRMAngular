import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Notification} from '../../models/notification.model';

@Component({
  selector: 'alert-component',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alert: Notification;
  @Output() clear: EventEmitter<Notification> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  viewAlert(): void {

  }

  clearAlert(): void {
    this.clear.emit(this.alert);
  }

}
