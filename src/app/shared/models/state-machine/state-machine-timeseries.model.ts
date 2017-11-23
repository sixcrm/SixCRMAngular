import {Moment, utc} from 'moment';

export class StateMachineTimeseries {

  datetime: Moment;
  count: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.datetime = utc(obj.datetime);
    this.count = obj.count || 0;
  }
}
