import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';
import {Products} from '../../../../shared/models/products.model';
import {Moment, utc} from 'moment';

@Component({
  selector: 'schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss']
})
export class ScheduleDetailsComponent implements OnInit {

  @Input() schedule: ProductSchedule | Schedule;
  @Input() hideDetails: boolean;
  @Input() products: Products[] = [];
  @Input() startDate: Moment;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  productMapper = (p: Product) => p.name;

  constructor() { }

  ngOnInit() { }

  isSchedule() {
    return this.schedule && this.schedule instanceof Schedule;
  }

  isProductSchedule() {
    return this.schedule && this.schedule instanceof ProductSchedule;
  }

  cancel() { }

  calculateNextCycle(): string {
    if (!this.schedule || !this.startDate) return '';

    let next = null;

    if (this.schedule instanceof Schedule) {
      next = this.calculateNexCycleOfSchedule(this.schedule);
    } else if (this.schedule instanceof ProductSchedule) {
      this.schedule.schedules.forEach(s => {
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

    return utc().add((schedule.period || schedule.end || 1) - daysAfterLast, 'd');
  }
}
