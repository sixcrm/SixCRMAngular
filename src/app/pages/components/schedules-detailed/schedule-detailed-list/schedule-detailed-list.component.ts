import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';

@Component({
  selector: 'schedule-detailed-list',
  templateUrl: './schedule-detailed-list.component.html',
  styleUrls: ['./schedule-detailed-list.component.scss']
})
export class ScheduleDetailedListComponent implements OnInit {

  @Input() productSchedules: ProductSchedule[] = [];
  @Output() selected: EventEmitter<ProductSchedule | Schedule> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  productScheduleCheckboxToggle(event, productSchedule: ProductSchedule) {
    this.deselectAll();

    if (event.checked) {
      productSchedule['detailedListSelected'] = true;
      this.selected.emit(productSchedule);
    } else {
      this.selected.emit(null);
    }
  }

  scheduleCheckboxToggle(event, schedule: Schedule) {
    this.deselectAll();

    if (event.checked) {
      schedule['detailedListSelected'] = true;
      this.selected.emit(schedule);
    } else {
      this.selected.emit(null);
    }
  }

  deselectAll() {
    for (let i = 0; i < this.productSchedules.length; i++) {
      this.productSchedules[i]['detailedListSelected'] = false;

      for (let j = 0; j < this.productSchedules[i].schedules.length; j++) {
        this.productSchedules[i].schedules[j]['detailedListSelected'] = false;
      }
    }
  }

  scheduleCollapseToggle(productSchedule: ProductSchedule) {
    productSchedule['detailedListOpened'] = !productSchedule['detailedListOpened'];
  }
}
