import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Moment, utc} from 'moment';
import {Schedule} from '../../../../shared/models/schedule.model';

@Component({
  selector: 'schedule-detailed-timeline',
  templateUrl: './schedule-detailed-timeline.component.html',
  styleUrls: ['./schedule-detailed-timeline.component.scss']
})
export class ScheduleDetailedTimelineComponent implements OnInit {
  @Input() productSchedules: ProductSchedule[] = [];
  @Input() set start(value: Moment) {
    this._start = value;
    this._diff = utc().diff(this._start.clone(), 'd');
  };
  @Input() set zoomLevel(value: number) {
    this._zoom = value;
    this.measureArray = this.createRangeArray(365 / value);
  }
  @Output() selected: EventEmitter<Schedule> = new EventEmitter();

  _start: Moment = utc();
  _diff: number = 0;
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
