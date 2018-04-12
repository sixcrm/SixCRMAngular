import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Moment, utc, tz} from 'moment-timezone';

@Injectable()
export class TimeService {

  constructor(private authService: AuthenticationService) {}

  format(moment: Moment | string, formatString?: string, dayGranularity?: boolean, timeGranularity?: boolean): string {
    let f: string;

    if (!formatString) {
      f = 'MM/DD/YYYY';
    } else {

      if (formatString === 'date-time') {
        f = 'MM/DD/YYYY h:mm A';
      } else if (formatString === 'time') {
        f = 'h:mm A';
      } else  {
        f = formatString;
      }
    }

    if (timeGranularity) {
      const mins = utc().diff(utc(moment), 'm');

      if (mins < 1) return 'Just now';
      if (mins < 50) return `${mins} minutes ago`;
      if (mins < 70) return `About hour ago`;
    }

    if (dayGranularity) {
      if (utc(moment).isSame(utc(), 'd')) {
        return `Today, ${utc(moment).tz(this.authService.getTimezone()).format('h:mm A')}`
      } else if (utc(moment).isSameOrAfter(utc().subtract(1, 'd'), 'd')) {
        return `Yesterday, ${utc(moment).tz(this.authService.getTimezone()).format('h:mm A')}`
      }
    }

    return utc(moment).tz(this.authService.getTimezone()).format(f);
  }

}
