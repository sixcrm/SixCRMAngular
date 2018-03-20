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

  startX: number;

  today: string = utc().format('MMMM DD');

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

  dragStarted(event, schedule: Schedule) {
    this.selected.emit(schedule);

    this.startX = event.clientX;
    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragDiff = 0;
    }
  }

  drag(event, schedule: Schedule) {
    if (event.clientX === 0) return;

    const diff = event.clientX - this.startX;

    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragDiff = diff;
    }
  }

  dragEnded(event, schedule: Schedule) {
    const diffInDays = Math.floor((event.clientX - this.startX) / (this.cellwidth / this._zoom));

    schedule.start = +schedule.start + diffInDays;

    if (schedule.end) {
      schedule.end = schedule.end + diffInDays;
    }

    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].start += diffInDays;
      schedule.cycles[i].end += diffInDays;
      schedule.cycles[i].dragDiff = 0;
    }
  }

  dragResizeStarted(event, schedule: Schedule) {
    this.selected.emit(schedule);

    this.startX = event.clientX;
    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragdiffDiff = 0;
    }
  }

  dragResize(event, schedule: Schedule) {
    if (event.clientX === 0) return;

    const diff = event.clientX - this.startX;

    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragdiffDiff = diff;
    }
  }

  dragResizeEnded(event, schedule: Schedule) {
    let diffInDays = Math.floor((event.clientX - this.startX) / (this.cellwidth / this._zoom));

    if (+schedule.period + diffInDays < 1) {
      diffInDays = 1 - +schedule.period;
    }

    if (schedule.end) {
      schedule.end = +schedule.end + diffInDays;
    }
    if (schedule.period) {
      schedule.period = +schedule.period + diffInDays;
    }

    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].end += diffInDays;
      schedule.cycles[i].diff += diffInDays;

      if (i !== 0) {
        schedule.cycles[i].start += i*diffInDays;
      }

      schedule.cycles[i].dragdiffDiff = 0;
    }
  }

  getHeightInPixels(): string {
    if (!this.productSchedules) return '1px';

    let count = 1;
    for (let i = 0; i < this.productSchedules.length; i++) {
      count++;

      if (this.productSchedules[i]['detailedListOpened']) {
        count += this.productSchedules[i].schedules.length;
      }
    }

    return count * this.cellheight - 16 + this.productSchedules.length + 'px';
  }
}
