import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Order} from '../../../shared/models/order.model';

@Component({
  selector: 'order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit {

  @Input() order: Order;

  @Output() orderSelected: EventEmitter<Order> = new EventEmitter();

  @Output() refund: EventEmitter<Order> = new EventEmitter();
  @Output() ret: EventEmitter<Order> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
}
