import {Entity} from './entity.interface';
import {Affiliate} from './affiliate.model';
import {utc, Moment} from 'moment';
import {Campaign} from './campaign.model';

let beautyHtml = require('js-beautify').html_beautify;

export class Tracker implements Entity<Tracker> {
  id: string;
  affiliates: Affiliate[] = [];
  eventType: string[] = [];
  name: string;
  type: string;
  body: string;
  link: string = '';
  campaigns: Campaign[] = [];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.type = obj.type || '';
    this.name = obj.name || '';
    this.body = obj.body ? (this.type === 'html' ? beautyHtml(obj.body) : obj.body) : '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

    if (obj.campaigns) {
      this.campaigns = obj.campaigns.map(c => new Campaign(c));
    }

    if (obj.event_type) {
      this.eventType = obj.event_type.slice();
    }

    if (obj.affiliates) {
      this.affiliates = obj.affiliates.map(a => new Affiliate(a));
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
      campaigns: this.campaigns.map(campaign => campaign.inverse()),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
