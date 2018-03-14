import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';

@Component({
  selector: 'schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss']
})
export class ScheduleDetailsComponent implements OnInit {

  @Input() schedule: ProductSchedule | Schedule;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  productMapper = (p: Product) => p.name;

  constructor() { }

  ngOnInit() {
  }

  isSchedule() {
    return this.schedule && this.schedule instanceof Schedule;
  }

  isProductSchedule() {
    return this.schedule && this.schedule instanceof ProductSchedule;
  }

  cancel() {

  }
}
