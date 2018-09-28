import {Component, OnInit, Input} from '@angular/core';
import {Rebill} from '../../../../shared/models/rebill.model';
import {Order} from '../../../../shared/models/order.model';

@Component({
  selector: 'info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss']
})
export class InfoTableComponent implements OnInit {

  @Input() rebill: Rebill;
  @Input() order: Order;

  constructor() { }

  ngOnInit() {
  }

  calculateCycle() {
    if (this.rebill) {
      return this.rebill.cycle || 0;
    }

    if (this.order) {
      return this.order.rebill.cycle || 0;
    }

    return '–';
  }

}
