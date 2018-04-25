import {Component, OnInit, Input} from '@angular/core';
import {Currency} from '../../../shared/utils/currency/currency';

@Component({
  selector: 'create-order-summary',
  templateUrl: './create-order-summary.component.html',
  styleUrls: ['./create-order-summary.component.scss']
})
export class CreateOrderSummaryComponent implements OnInit {

  @Input() price: Currency = new Currency(0);
  @Input() shipping: Currency = new Currency(0);
  @Input() total: Currency = new Currency(0);

  constructor() { }

  ngOnInit() {
  }

}
