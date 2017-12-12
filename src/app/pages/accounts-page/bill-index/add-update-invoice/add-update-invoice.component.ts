import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Bill} from '../../../../shared/models/bill.model';

@Component({
  selector: 'add-update-invoice',
  templateUrl: './add-update-invoice.component.html',
  styleUrls: ['./add-update-invoice.component.scss']
})
export class AddUpdateInvoiceComponent implements OnInit {

  @Input() bill: Bill;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  save() {

  }
}
