import {Component, OnInit, Input} from '@angular/core';
import {Notification} from '../../../shared/models/notification.model';

@Component({
  selector: 'alert-component',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alert: Notification;

  constructor() { }

  ngOnInit() {
  }

  viewAlert(): void {

  }

  clearAlert(): void {

  }

}
