import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Bill} from '../../../../shared/models/bill.model';
import {Currency} from '../../../../shared/utils/currency/currency';

@Component({
  selector: 'invoice-overdue',
  templateUrl: './invoice-overdue.component.html',
  styleUrls: ['./invoice-overdue.component.scss']
})
export class InvoiceOverdueComponent implements OnInit {

  @Input() bill: Bill;

  @Output() view: EventEmitter<Bill> = new EventEmitter();
  @Output() pay: EventEmitter<Bill> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  calculateAmount(): string {
    if (!this.bill) {
      return new Currency(0).usd();
    }

    return new Currency(this.bill.detail.map(d => d.amount.amount).reduce((a,b)=>a+b,0)).usd();
  }

}
