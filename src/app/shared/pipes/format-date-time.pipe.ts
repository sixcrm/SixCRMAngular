import { Pipe, PipeTransform } from '@angular/core';
import {Moment, tz, utc} from 'moment-timezone';
import {TimeService} from '../services/time.service';


@Pipe({
  name: 'formatDateTime'
})
export class FormatDateTimePipe implements PipeTransform {

  constructor(private timeService: TimeService) {};

  transform(value: Moment, format?: string, dayGranularity?: boolean): any {
    return this.timeService.format(value, format, dayGranularity);
  }

}
