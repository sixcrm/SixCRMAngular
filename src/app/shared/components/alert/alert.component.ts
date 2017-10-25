import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Notification} from '../../models/notification.model';

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

  constructor() { }

  ngOnInit() {
  }

  viewAlert(): void {
    this.view.emit(this.alert);
  }

  clearAlert(): void {
    this.clear.emit(this.alert);
  }

}
