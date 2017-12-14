import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Bill} from '../../../../shared/models/bill.model';

@Component({
  selector: 'bill-add-new',
  templateUrl: './bill-add-new.component.html',
  styleUrls: ['./bill-add-new.component.scss']
})
export class BillAddNewComponent implements OnInit {

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<Bill> = new EventEmitter();

  @Input() bill: Bill;

  accounts: Account[] = [];

  constructor() { }

  ngOnInit() {

  }

}
