import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';
import {Products} from '../../../../shared/models/products.model';
import {Moment, utc} from 'moment';
import {isAllowedNumeric} from '../../../../shared/utils/form.utils';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss']
})
export class ScheduleDetailsComponent implements OnInit, OnDestroy {

  _schedule: Schedule;
  _scheduleBackup: Schedule;
  _productSchedule: ProductSchedule;
  _product: Product;

  @Input() set schedule(value: ProductSchedule | Schedule | Product) {
    this._productSchedule = null;
    this._schedule = null;
    this._scheduleBackup = null;
    this._product = null;

    this.productToAdd = new Product();

    if (value instanceof Schedule) {
      this._schedule = value;
      this._scheduleBackup = this._schedule.copy();
      this.selectedIndex = 0;
    }

    if (value instanceof ProductSchedule) {
      this._productSchedule = value;
    }


    if (value instanceof Product) {
      this._product = value;
      this.selectedIndex = 0;
    }

    this.calculateNextCycle();
  };
  @Input() hideDetails: boolean;
  @Input() allProducts: Products[] = [];
  @Input() startDate: Moment;
  @Input() singleScheduleMode: boolean;
  @Input() editable: boolean = true;

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<boolean> = new EventEmitter();
  @Output() focusSchedule: EventEmitter<Schedule> = new EventEmitter();
  @Output() deleteSchedule: EventEmitter<Schedule> = new EventEmitter();
  @Output() deleteProductSchedule: EventEmitter<ProductSchedule> = new EventEmitter();

  isNumeric = isAllowedNumeric;
  productMapper = (p: Product) => p.name;
  productToAdd: Product = new Product();

  selectedIndex: number = 0;
  changeSub: Subscription;
  nextCycle: string = '';
  imagePath: string = '/assets/images/product-image-placeholder.svg';

  constructor(private authService: AuthenticationService) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.changeSub) {
      this.changeSub.unsubscribe();
    }
  }

  calculateNextCycle(): void {
    if ((!this._schedule && !this._productSchedule && !this._product) || !this.startDate) return;

    let next = null;
    let imagePath = null;

    if (this._schedule) {
      next = this.calculateNexCycleOfSchedule(this._schedule);
      imagePath = this._schedule.product.getDefaultImagePath();
    } else if (this._productSchedule) {
      this._productSchedule.schedules.forEach(s => {
        const current = this.calculateNexCycleOfSchedule(s);

        if (current && (!next || current.isBefore(next))) {
          next = current;
          imagePath = s.product.getDefaultImagePath();
        }
      });
    } else if (this._product) {
      next = null;
      imagePath = this._product.getDefaultImagePath();
    }

    if (!next) {
      this.nextCycle = 'Completed';
    } else {
      this.nextCycle = next.tz(this.authService.getTimezone()).format('MMMM DD, YYYY');
    }

    this.imagePath = imagePath || '/assets/images/product-image-placeholder.svg';
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

  saveSchedule() {
    if (!this._scheduleBackup.sameDayOfMonth && +this._scheduleBackup.period <= 0) return;

    this._schedule.start = +this._scheduleBackup.start;
    this._schedule.end = +this._scheduleBackup.end;
    this._schedule.price = this._scheduleBackup.price;
    this._schedule.period = +this._scheduleBackup.period;
    this._schedule.sameDayOfMonth = this._scheduleBackup.sameDayOfMonth;
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

  saveProductSchedule() {
    if (!this._productSchedule) return;

    this.save.emit(true);
  }

  setCycleSameDay() {
    if (!this.editable) return;

    this._scheduleBackup.period = 0;
    this._scheduleBackup.sameDayOfMonth = true;
  }

  setCycleRepeatEvery() {
    if (!this.editable) return;

    this._scheduleBackup.period = this._scheduleBackup.period  || 30;
    this._scheduleBackup.sameDayOfMonth = false;
  }
}
