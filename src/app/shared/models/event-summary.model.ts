import {Moment, utc} from 'moment';

export class EventSummaryEvent {
  type: string;
  count: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.type = obj.event_type || '';
    this.count = obj.count ? Number(obj.count) : 0;
  }
}

export class EventSummary {
  date: Moment;
  events: EventSummaryEvent[] = [];

  constructor(obj?: any) {
    if (!obj){
      obj = {};
    }

    this.date = utc(obj.datetime);

    if (obj.byeventtype) {
      obj.byeventtype.forEach(event => this.events.push(new EventSummaryEvent(event)));
    }
  }
}
