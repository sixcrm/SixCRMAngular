import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Moment, utc} from 'moment';
import {Schedule, Cycle} from '../../../../shared/models/schedule.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Subject} from 'rxjs';
import {Product} from '../../../../shared/models/product.model';
import {scrollByX} from '../../../../shared/utils/document.utils';

@Component({
  selector: 'schedule-detailed-timeline',
  templateUrl: './schedule-detailed-timeline.component.html',
  styleUrls: ['./schedule-detailed-timeline.component.scss']
})
export class ScheduleDetailedTimelineComponent implements OnInit {

  @ViewChild('container') container;

  days: number = 365;

  @Input() set numberOfDays(value: number) {
    this.days = value;
    this.measureArray = this.createRangeArray(this.days / this._zoom);
  }

  @Input() set scrollTo(value: ProductSchedule | Schedule | Product) {
    this.performScroll(value);
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
  @Output() selected: EventEmitter<ProductSchedule | Schedule | Product> = new EventEmitter();
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

  green: string = 'rgba(193,244,221,1)';
  greenText: string = '#2F824D';
  greenSelected: string = 'rgba(47,195,98,1)';
  greenBackground: string = 'rgba(47,195,97,0.12)';

  blue: string = 'rgba(167,220,246,1)';
  blueText: string = '#3F587B';
  blueSelected: string = 'rgba(75,144,221,1)';
  blueBackground: string = 'rgba(83,131,195,0.12)';

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

  dragStarted(event, schedule: Schedule, productSchedule: ProductSchedule) {
    if (!productSchedule['detailedListOpened']) {
      this.selected.emit(productSchedule);
      for (let i = 0; i < productSchedule.schedules.length; i++) {
        this.dragScheduleStarted(event, productSchedule.schedules[i])
      }
    } else {
      this.selected.emit(schedule);
      this.dragScheduleStarted(event, schedule);
    }

  }

  private dragScheduleStarted(event, schedule: Schedule) {
    this.startX = event.clientX;
    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragDiff = 0;
      schedule.cycles[i].dragInProgress = true;
    }
  }

  drag(event, schedule: Schedule, productSchedule: ProductSchedule) {
    if (!productSchedule['detailedListOpened']) {
      for (let i = 0; i < productSchedule.schedules.length; i++) {
        this.dragSchedule(event, productSchedule.schedules[i])
      }
    } else {
      this.dragSchedule(event, schedule);
    }
  }

  private dragSchedule(event, schedule: Schedule) {
    if (event.clientX === 0) return;

    const diff = event.clientX - this.startX;

    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragDiff = diff;
    }
  }

  dragEnded(event, schedule: Schedule, productSchedule: ProductSchedule) {
    this.changeDebouncer.next(true);

    if (!productSchedule['detailedListOpened']) {
      for (let i = 0; i < productSchedule.schedules.length; i++) {
        this.dragScheduleEnded(event, productSchedule.schedules[i])
      }
    } else {
      this.dragScheduleEnded(event, schedule)
    }
  }

  private dragScheduleEnded(event, schedule: Schedule) {
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
      schedule.cycles[i].dragInProgress = false;
    }
  }

  dragResizeStarted(event, schedule: Schedule, cycleNum: number) {
    this.selected.emit(schedule);

    if (schedule.sameDayOfMonth && cycleNum < (schedule.cycles.length - 1)) return;

    this.startX = event.clientX;
    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragdiffDiff = 0;
      schedule.cycles[i].dragdiffDays = 0;
      schedule.cycles[i].dragInProgress = true;
    }
  }

  dragResize(event, schedule: Schedule, cycleNum: number) {
    if (event.clientX === 0) return;

    if (schedule.sameDayOfMonth && cycleNum < (schedule.cycles.length - 1)) return;

    schedule.cycles[cycleNum].dragdiffDiff = event.clientX - this.startX;

    const dragdiffDays = Math.floor((event.clientX - this.startX) / (this.cellwidth / this._zoom));
    for (let i = 0; i < schedule.cycles.length; i++) {
      schedule.cycles[i].dragdiffDays = dragdiffDays;
      schedule.cycles[i].durationDragInProgress = cycleNum === (schedule.cycles.length - 1);
      schedule.cycles[i].periodDragInProgress = cycleNum !== (schedule.cycles.length - 1);
    }
  }

  dragResizeEnded(event, schedule: Schedule, cycleNum: number) {
    if (schedule.sameDayOfMonth && cycleNum < (schedule.cycles.length - 1)) return;

    this.changeDebouncer.next(true);

    let diffInDays = Math.floor((event.clientX - this.startX) / (this.cellwidth / this._zoom));

    if (!schedule.sameDayOfMonth && +schedule.period > 0 && +schedule.period + diffInDays < 1) {
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
      for (let i = 0; i < schedule.cycles.length; i++) {
        schedule.cycles[i].dragInProgress = false;
        schedule.cycles[i].durationDragInProgress = false;
        schedule.cycles[i].periodDragInProgress = false;
        schedule.cycles[i].dragdiffDays = 0;
      }
    } else {
      for (let i = 0; i < schedule.cycles.length; i++) {
        schedule.cycles[i].diff += diffInDays;

        if (i !== 0) {
          schedule.cycles[i].start += i*diffInDays;
        }

        schedule.cycles[i].dragdiffDiff = 0;
        schedule.cycles[i].dragdiffDays = 0;
        schedule.cycles[i].durationDragInProgress = false;
        schedule.cycles[i].periodDragInProgress = false;
        schedule.cycles[i].dragInProgress = false;
      }
    }
  }

  getHeight(productScheduleNum, scheduleNum): string {
    if (productScheduleNum === 0) {
      if (this.productSchedules[0]['detailedListOpened']) {
        return (scheduleNum + 1) * this.cellheight + 55 + 'px';
      } else {
        return '55px';
      }
    }

    let cells = 0;

    for (let i = 0; i < productScheduleNum; i++) {
        cells += this.productSchedules[i]['detailedListOpened'] ? this.productSchedules[i].schedules.length + 1 : 1;
    }

    return (cells + (this.productSchedules[productScheduleNum]['detailedListOpened'] ? (scheduleNum + 1) : 0)) * this.cellheight + 55 + 'px';
  }

  scrolled(event) {
    if (event.target.scrollLeft + event.target.offsetWidth >= event.target.scrollWidth) {
      this.loadMoreDebouncer.next(true);
    }
  }

  calculateDaysDiff(cycle: Cycle, schedule: Schedule): string {
    if (cycle.dragInProgress && cycle.dragdiffDiff !== 0) {
      const days = Math.floor(cycle.dragdiffDiff / (this.cellwidth / this._zoom));

      if (days === 0) return '';

      return `${days > 0 ? '+': ''}${days} Days`;
    }

    if (cycle.start !== schedule.start && cycle.end !== schedule.end) return '';

    const days = Math.floor(cycle.dragDiff / (this.cellwidth / this._zoom));

    if (days === 0) return '';

    return `${days > 0 ? '+': ''}${days} Days`;
  }

  private performScroll(value: Product | Schedule | ProductSchedule) {
    if (value instanceof ProductSchedule) {
      if (value.schedules.length === 0) return;

      let start = value.schedules[0].start;
      for (let i = 1; i < value.schedules.length; i++) {
        if (value.schedules[i].start < start) {
          start = value.schedules[i].start;
        }
      }

      start = start * this.cellwidth / this._zoom;

      scrollByX(this.container, start);
    } else if (value instanceof Schedule) {
      const start = value.start * this.cellwidth / this._zoom;

      scrollByX(this.container, start);
    } else if (value instanceof Product) {
      scrollByX(this.container, 0);
    }
  }
}
