import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Moment, utc} from 'moment';
import {Schedule} from '../../../../shared/models/schedule.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Subject} from 'rxjs';
import {Product} from '../../../../shared/models/product.model';

@Component({
  selector: 'schedule-detailed-timeline',
  templateUrl: './schedule-detailed-timeline.component.html',
  styleUrls: ['./schedule-detailed-timeline.component.scss']
})
export class ScheduleDetailedTimelineComponent implements OnInit {

  days: number = 365;

  @Input() set numberOfDays(value: number) {
    this.days = value;
    this.measureArray = this.createRangeArray(this.days / this._zoom);
  }

  @Input() productSchedules: ProductSchedule[] = [];
  @Input() products: Product[] = [];
  @Input() singleScheduleMode: boolean;
  @Input() set start(value: Moment) {
    this._start = value;
    this._diff = utc().diff(this._start.clone(), 'd');
  };
  @Input() set zoomLevel(value: number) {
    this._zoom = value;
    this.measureArray = this.createRangeArray(this.days / this._zoom);
  }
  @Output() selected: EventEmitter<Schedule | Product> = new EventEmitter();
  @Output() scheduleChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() loadMoreDays: EventEmitter<boolean> = new EventEmitter();

  _start: Moment = utc();
  _diff: number = 0;
  _zoom: number = 1;
  measureArray: number[] = this.createRangeArray(this.days);

  cellwidth: number = 65;
  cellheight: number = 46;

  startX: number;

  today: string = '';

  green: string = 'rgba(47,195,97,1)';
  greenTail: string = 'rgba(47,195,97,0.22)';

  blue: string = 'rgba(83,131,195,1)';
  blueTail: string = 'rgba(83,131,195,0.22)';

  changeDebouncer: Subject<boolean> = new Subject();
  loadMoreDebouncer: Subject<boolean> = new Subject();

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.today = utc().tz(this.authService.getTimezone()).format('MMMM DD');

    this.changeDebouncer.debounceTime(270).subscribe(() => this.scheduleChanged.emit(true));
    this.loadMoreDebouncer.debounceTime(500).subscribe(() => this.loadMoreDays.emit(true));
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
    this.changeDebouncer.next(true);

    let diffInDays = Math.floor((event.clientX - this.startX) / (this.cellwidth / this._zoom));

    if (schedule.start + diffInDays < 0) {
      diffInDays = -schedule.start;
    }

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

  dragResize(event, schedule: Schedule, cycleNum: number) {
    if (event.clientX === 0) return;

    schedule.cycles[cycleNum].dragdiffDiff = event.clientX - this.startX;
  }

  dragResizeEnded(event, schedule: Schedule, cycleNum: number) {
    this.changeDebouncer.next(true);

    let diffInDays = Math.floor((event.clientX - this.startX) / (this.cellwidth / this._zoom));

    if (+schedule.period + diffInDays < 1) {
      diffInDays = 1 - +schedule.period;
    }

    if (cycleNum === (schedule.cycles.length - 1)) {
      if (schedule.end) {
        schedule.end = +schedule.end + diffInDays;
      }
    } else {
      if (schedule.period) {
        schedule.period = +schedule.period + diffInDays;
      }
    }

    if (cycleNum === (schedule.cycles.length - 1)) {
      schedule.cycles[cycleNum].end += diffInDays;
      schedule.cycles[cycleNum].diff += diffInDays;
      schedule.cycles[cycleNum].dragdiffDiff = 0;
    } else {
      for (let i = 0; i < schedule.cycles.length; i++) {
        schedule.cycles[i].diff += diffInDays;

        if (i !== 0) {
          schedule.cycles[i].start += i*diffInDays;
        }

        schedule.cycles[i].dragdiffDiff = 0;
      }
    }
  }

  getHeight(productScheduleNum, scheduleNum): string {
    if (productScheduleNum === 0) {
      if (this.productSchedules[0]['detailedListOpened']) {
        return (scheduleNum + 1) * this.cellheight + 30 + 'px';
      } else {
        return '30px';
      }
    }

    let cells = 0;

    for (let i = 0; i < productScheduleNum; i++) {
        cells += this.productSchedules[i]['detailedListOpened'] ? this.productSchedules[i].schedules.length + 1 : 1;
    }

    return (cells + (this.productSchedules[productScheduleNum]['detailedListOpened'] ? (scheduleNum + 1) : 0)) * this.cellheight + 30 + 'px';
  }

  scrolled(event) {
    if (event.target.scrollLeft + event.target.offsetWidth >= event.target.scrollWidth) {
      this.loadMoreDebouncer.next(true);
    }
  }
}
