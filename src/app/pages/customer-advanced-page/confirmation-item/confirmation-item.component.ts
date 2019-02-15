import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Session} from '../../../shared/models/session.model';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';

@Component({
  selector: 'confirmation-item',
  templateUrl: './confirmation-item.component.html',
  styleUrls: ['./confirmation-item.component.scss']
})
export class ConfirmationItemComponent implements OnInit {

  @Input() sessionConfirmation: Session;

  @Output() confirmDelivery: EventEmitter<Session> = new EventEmitter();
  @Output() confirmTrial: EventEmitter<Session> = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  confirm() {
    const isDeliveryConfirmation = !this.sessionConfirmation.trialConfirmation.delivered_at;

    let ref = this.dialog.open(DeleteDialogComponent);
    ref.componentInstance.text = `${isDeliveryConfirmation ? 'Delivery': 'Trial'} Confirmation`;
    ref.componentInstance.secondaryText = `Are you sure you want to confirm ${isDeliveryConfirmation ? `delivery of` : ''} ${this.sessionConfirmation.alias}?`;

    ref.afterClosed().subscribe(result => {
      ref = null;

      if (result && result.success) {
        if (isDeliveryConfirmation) {
          this.confirmDelivery.emit(this.sessionConfirmation);
        } else {
          this.confirmTrial.emit(this.sessionConfirmation);
        }
      }

    })
  }
}
