import {Component, OnInit, Output, EventEmitter, ViewChild, Input, ElementRef, AfterViewInit} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Schedule} from '../../../shared/models/schedule.model';

export enum DisplayModes {
  grid,
  list
}

@Component({
  selector: 'schedules-detailed',
  templateUrl: './schedules-detailed.component.html',
  styleUrls: ['./schedules-detailed.component.scss']
})
export class SchedulesDetailedComponent implements OnInit, AfterViewInit {

  @Input() productSchedules: ProductSchedule[] = [];

  @Output() detailsComponent: EventEmitter<ElementRef> = new EventEmitter();

  @ViewChild('details') details: ElementRef;

  selectedSchedule: ProductSchedule | Schedule;
  displayMode: DisplayModes = DisplayModes.grid;

  productScheduleFilterMapper = (ps: ProductSchedule) => ps.name;
  filterProductSchedulesValue: string;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.detailsComponent.emit(this.details);
  }

  selectDetails(selected: ProductSchedule | Schedule) {
    this.selectedSchedule = selected;

    this.detailsComponent.emit(this.details);
  }

  deselectSchedule() {
    this.selectedSchedule = null;

    for (let i = 0; i < this.productSchedules.length; i++) {
      this.productSchedules[i]['detailedListSelected'] = false;

      for (let j = 0; j < this.productSchedules[i].schedules.length; j++) {
        this.productSchedules[i].schedules[j]['detailedListSelected'] = false;
      }
    }
  }
}
