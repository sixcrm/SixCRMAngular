import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';
import {Products} from '../../../../shared/models/products.model';
import {Moment, utc} from 'moment';
import {isAllowedNumeric} from '../../../../shared/utils/form.utils';
import {Subject, Subscription} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss'],
  host: {'(document:keydown)': 'parseDeleteKey($event)'}
})
export class ScheduleDetailsComponent implements OnInit, OnDestroy {

  _schedule: Schedule;
  _scheduleBackup: Schedule;
  _productSchedule: ProductSchedule;

  @Input() set schedule(value: ProductSchedule | Schedule) {
    this._productSchedule = null;
    this._schedule = null;
    this._scheduleBackup = null;

    this.productToAdd = new Product();

    if (value instanceof Schedule) {
      this._schedule = value;
      this._scheduleBackup = this._schedule.copy();
    }

    if (value instanceof ProductSchedule) {
      this._productSchedule = value;
    }

    this.nextCycle = this.calculateNextCycle();
  };
  @Input() hideDetails: boolean;
  @Input() allProducts: Products[] = [];
  @Input() startDate: Moment;
  @Input() singleScheduleMode: boolean;

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<boolean> = new EventEmitter();
  @Output() focusSchedule: EventEmitter<Schedule> = new EventEmitter();
  @Output() deleteSchedule: EventEmitter<Schedule> = new EventEmitter();
  @Output() deleteProductSchedule: EventEmitter<ProductSchedule> = new EventEmitter();

  isNumeric = isAllowedNumeric;
  productMapper = (p: Product) => p.name;
  productToAdd: Product = new Product();

  changeSub: Subscription;
  nextCycle: string = '';

  constructor(private authService: AuthenticationService) { }

  ngOnInit() { }

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

    return next.tz(this.authService.getTimezone()).format('MMMM DD, YYYY');
  }

  calculateNexCycleOfSchedule(schedule: Schedule): Moment {
    const dayInCycle = utc().diff(this.startDate.clone(), 'd');

    for (let i = 0; i < schedule.cycles.length; i++) {
      if (schedule.cycles[i].start >= dayInCycle) {
        return utc().add(schedule.cycles[i].start - dayInCycle, 'd')
      }
    }

    return null;
  }

  recalculate() { }

  saveSchedule() {
    this._schedule.start = +this._scheduleBackup.start;
    this._schedule.end = +this._scheduleBackup.end;
    this._schedule.period = +this._scheduleBackup.period;
    this._schedule.product = this._scheduleBackup.product.copy();

    this.save.emit(true);
  }

  removeSchedule() {
    this.deleteSchedule.emit(this._schedule);
  }

  removeProductSchedule() {
    this.deleteProductSchedule.emit(this._productSchedule);
  }

  closeModal() {
    this.close.emit(true)
  }

  persistNewSchedule() {
    if (!this.productToAdd.id || !this._productSchedule) return;

    const last = this._productSchedule.schedules.length > 0
      ? this._productSchedule.schedules[this._productSchedule.schedules.length - 1]
      : new Schedule();

    const schedule = new Schedule({
      product: this.productToAdd.copy(),
      start: last.end || 0,
      period: last.period || 30,
      end: (last.end || 0) + (last.period || 30)
    });

    this._productSchedule.schedules.push(schedule);

    this.productToAdd = new Product();

    this.save.emit(true);
  }

  parseDeleteKey(key) {
    if (key.key !== 'Delete') return;

    if (this._schedule) {
      this.removeSchedule();
    } else if (this._productSchedule && !this.singleScheduleMode) {
      this.removeProductSchedule();
    }
  }
}
