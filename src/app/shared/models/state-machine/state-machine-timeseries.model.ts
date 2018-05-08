import {Moment, utc} from 'moment';

export class StateMachineTimeseries {

  datetime: Moment;
  count: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    for (let element of obj) {
      if (element.key === 'count') {
        this.count = parseInt(element.value) || 0;
      } else if (element.key === 'datetime') {
        this.datetime = utc(element.value);
      }
    }
  }
}
