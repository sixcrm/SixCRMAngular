import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Product} from '../../../../../shared/models/product.model';
import {Schedule} from '../../../../../shared/models/schedule.model';
import {ProductSchedule} from '../../../../../shared/models/product-schedule.model';

@Component({
  selector: 'schedule-details-header',
  templateUrl: './schedule-details-header.component.html',
  styleUrls: ['./schedule-details-header.component.scss']
})
export class ScheduleDetailsHeaderComponent implements OnInit {

  @Input() product: Product;
  @Input() schedule: Schedule;
  @Input() productSchedule: ProductSchedule;

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() removeProduct: EventEmitter<boolean> = new EventEmitter();
  @Output() removeProductSchedule: EventEmitter<boolean> = new EventEmitter();
  @Output() removeSchedule: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}