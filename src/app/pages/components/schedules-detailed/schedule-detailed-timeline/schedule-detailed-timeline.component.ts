import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Moment} from 'moment';
import {Schedule} from '../../../../shared/models/schedule.model';

@Component({
  selector: 'schedule-detailed-timeline',
  templateUrl: './schedule-detailed-timeline.component.html',
  styleUrls: ['./schedule-detailed-timeline.component.scss']
})
export class ScheduleDetailedTimelineComponent implements OnInit {

  @Input() productSchedules: ProductSchedule[] = [];
  @Input() start: Moment;
  @Input() set zoomLevel(value: number) {
    this._zoom = value;
    this.measureArray = this.createRangeArray(365 / value);
  }
  @Output() selected: EventEmitter<Schedule> = new EventEmitter();

  _zoom: number = 1;
  measureArray: number[] = this.createRangeArray(365);

  cellwidth: number = 65;
  cellheight: number = 46;

  constructor() { }

  ngOnInit() {
  }

  createRangeArray(count: number) {
    let temp = [];
    for (let i = 0; i <= count; i++) {
      temp.push(i);
    }

    return temp;
  }

}
