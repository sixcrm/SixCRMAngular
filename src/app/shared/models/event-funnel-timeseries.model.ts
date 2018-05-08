import {Moment} from 'moment';
export class EventFunnelTimeseries {
  events: any;
  datetime: Moment[] = [];
  count: number[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    for (let array of obj) {
      for (let element of array) {
        if (element.key === 'eventcount') {
          this.count.push(parseInt(element.value) || 0)
        } else if (element.key === 'datetime') {
          this.datetime.push(element.value)
        }
      }
    }
  }
}
