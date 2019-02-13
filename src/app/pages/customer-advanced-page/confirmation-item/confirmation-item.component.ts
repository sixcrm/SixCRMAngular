import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Session} from '../../../shared/models/session.model';

@Component({
  selector: 'confirmation-item',
  templateUrl: './confirmation-item.component.html',
  styleUrls: ['./confirmation-item.component.scss']
})
export class ConfirmationItemComponent implements OnInit {

  @Input() sessionConfirmation: Session;

  @Output() confirmDelivery: EventEmitter<Session> = new EventEmitter();
  @Output() confirmTrial: EventEmitter<Session> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  confirm() {
    if (this.sessionConfirmation.trialConfirmation.delivered_at) {
      this.confirmTrial.emit(this.sessionConfirmation);
    } else {
      this.confirmDelivery.emit(this.sessionConfirmation);
    }
  }
}
