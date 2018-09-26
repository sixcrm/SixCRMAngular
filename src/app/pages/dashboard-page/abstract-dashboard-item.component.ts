import {Input} from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {Moment} from 'moment';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {flatUp} from '../../shared/models/filter-term.model';

export class AbstractDashboardItem {

  start: Moment;
  end: Moment;
  shouldFetch: boolean;
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  serverError: CustomServerError;
  loading: boolean = false;

  @Input() set date(dates) {
    if (dates) {
      this.start = dates.start;
      this.end = flatUp(dates.end);
      this.shouldFetch = true;
    }
  }

  constructor() {};

  destroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
