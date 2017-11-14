import {Moment, utc} from 'moment';

export class StateMachineTimeseries {

  period: Moment;
  count: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.period = utc(obj.period);
    this.count = obj.count || 0;
  }
}
