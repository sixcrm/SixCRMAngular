import {Entity} from './entity.interface';
import {Affiliate} from './affiliate.model';
import {utc, Moment} from 'moment';

let beautyHtml = require('js-beautify').html_beautify;

export class Tracker implements Entity<Tracker> {
  id: string;
  affiliates: Affiliate[] = [];
  eventType: string[] = [];
  name: string;
  type: string;
  body: string;
  link: string = '';
  createdAt: Moment;
  updateAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.type = obj.type || '';
    this.name = obj.name || '';
    this.body = obj.body ? (this.type === 'html' ? beautyHtml(obj.body) : obj.body) : '';
    this.createdAt = utc(obj.created_at);
    this.updateAt = utc(obj.updated_at);

    if (obj.event_type) {
      Object.keys(obj.event_type).forEach(key => this.eventType.push(obj.event_type[key]));
    }
    if (obj.affiliates) {
      Object.keys(obj.affiliates).forEach(key => this.affiliates.push(new Affiliate(obj.affiliates[key])));
    }

    if (this.type === 'html') {
      let obj = {};
      obj['class'] = 'Tracker';
      obj['method'] = 'view';
      obj['tracker'] = {id: this.id};
      this.link = 'https://api.sixcrm.com/publichtml/' + btoa(JSON.stringify(obj));
    }
  }

  copy(): Tracker {
    return new Tracker(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      event_type: this.eventType,
      name: this.name,
      type: this.type,
      body: this.body,
      affiliates: this.affiliates.map(affiliate => affiliate.inverse()),
      created_at: this.createdAt.format(),
      updated_at: this.updateAt.format()
    }
  }
}
