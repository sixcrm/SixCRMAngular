import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Bill} from '../../../shared/models/bill.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Currency} from '../../../shared/utils/currency/currency';

@Component({
  selector: 'bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.scss']
})
export class BillViewComponent implements OnInit {

  @Input() bill: Bill;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

  calculateAmount(): string {
    if (!this.bill) {
      return new Currency(0).usd();
    }

    return new Currency(this.bill.detail.map(d => d.amount.amount).reduce((a,b)=>a+b,0)).usd();
  }
}
