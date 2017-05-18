import {Input} from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {Moment} from 'moment';

export class AbstractDashboardItem {

  start: Moment;
  end: Moment;
  shouldFetch: boolean;
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  @Input() set date(dates) {
    if (dates) {
      this.start = dates.start;
      this.end = dates.end;
      this.shouldFetch = true;
    }
  }

  constructor() {};

  destroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
