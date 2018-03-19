import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';
import {Products} from '../../../../shared/models/products.model';
import {Moment, utc} from 'moment';
import {isAllowedNumeric} from '../../../../shared/utils/form.utils';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss']
})
export class ScheduleDetailsComponent implements OnInit, OnDestroy {

  _schedule: Schedule;
  _scheduleBackup: Schedule;
  _productSchedule: ProductSchedule;

  @Input() set schedule(value: ProductSchedule | Schedule) {
    this._productSchedule = null;
    this._schedule = null;

    if (value instanceof Schedule) {
      this._schedule = value;
      this._scheduleBackup = this._schedule.copy();
    }

    if (value instanceof ProductSchedule) {
      this._productSchedule = value;
    }
  };
  @Input() hideDetails: boolean;
  @Input() products: Products[] = [];
  @Input() startDate: Moment;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  isNumeric = isAllowedNumeric;
  productMapper = (p: Product) => p.name;

  changeBouncer: Subject<boolean> = new Subject();
  changeSub: Subscription;

  constructor() { }

  ngOnInit() {
    this.changeSub = this.changeBouncer.debounceTime(500).subscribe(() => this._schedule.recalculateCyclesForDays(365));
  }

  ngOnDestroy() {
    if (this.changeSub) {
      this.changeSub.unsubscribe();
    }
  }

  calculateNextCycle(): string {
    if ((!this._schedule && !this._productSchedule) || !this.startDate) return '';

    let next = null;

    if (this._schedule) {
      next = this.calculateNexCycleOfSchedule(this._schedule);
    } else if (this._productSchedule) {
      this._productSchedule.schedules.forEach(s => {
        const current = this.calculateNexCycleOfSchedule(s);

        if (current && (!next || current.isBefore(next))) {
          next = current;
        }
      });
    }

    if (!next) return 'Completed';

    return next.format('MMMM DD, YYYY');
  }

  calculateNexCycleOfSchedule(schedule: Schedule): Moment {
    const dayInCycle = utc().diff(this.startDate.clone(), 'd');

    if (schedule.start && schedule.start > dayInCycle) return this.startDate.clone().add(schedule.start, 'd');

    if (schedule.end === 0 && dayInCycle === 0) return utc();

    if (schedule.end === 0 && dayInCycle > 0) return null;

    if (schedule.end && (schedule.end < dayInCycle)) return null;

    const daysAfterLast = dayInCycle % (schedule.period || schedule.end || 1);

    if (daysAfterLast === 0) return utc();

    return utc().add((schedule.start || 0) + (schedule.period || schedule.end || 1) - daysAfterLast, 'd');
  }

  cancel() {
    if (this._schedule) {
      this._schedule.start = this._scheduleBackup.start;
      this._schedule.end = this._scheduleBackup.end;
      this._schedule.period = this._scheduleBackup.period;
      this._schedule.product = this._scheduleBackup.product.copy();
      this._schedule.recalculateCyclesForDays(365);
    }
  }

  recalculate() {
    if (this._schedule) {
      this.changeBouncer.next(true);
    }
  }

  saveSchedule() {

  }

  closeModal() {
    this.cancel();
    this.close.emit(true)
  }
}
