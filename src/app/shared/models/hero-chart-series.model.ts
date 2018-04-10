import {Moment, utc} from 'moment';

export class HeroChartSeries {
  facet: string;
  timeseries: {datetime: Moment, value: number}[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.facet = obj.facet;
    this.timeseries = obj.timeseries.map(t => {
      return {datetime: utc(t.datetime), value: t.value}
    })
  }
}
