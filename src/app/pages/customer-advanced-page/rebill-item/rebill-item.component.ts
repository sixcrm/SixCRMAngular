import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ReturnDialogComponent} from '../../../dialog-modals/return-dialog/return-dialog.component';
import {RefundDialogComponent} from '../../../dialog-modals/refund-dialog/refund-dialog.component';
import {Transaction} from '../../../shared/models/transaction.model';

@Component({
  selector: 'rebill-item',
  templateUrl: './rebill-item.component.html',
  styleUrls: ['./rebill-item.component.scss']
})
export class RebillItemComponent implements OnInit {

  @Input() rebill: Rebill;
  @Input() pending: boolean;

  @Output() rebillSelected: EventEmitter<Rebill> = new EventEmitter();

  @Output() refund: EventEmitter<Rebill> = new EventEmitter();
  @Output() ret: EventEmitter<Rebill> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToWatermark(rebill: Rebill) {
    this.router.navigate(['/sessions', rebill.parentSession.id], {fragment: 'watermark'})
  }
}
