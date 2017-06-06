import {Moment, utc} from 'moment';

export class Activity {
  id: string;
  date: Moment;
  actor: string;
  actorType: string;
  action: string;
  actedUpon: string;
  actedUponType: string;
  associatedWith: string;
  associatedWithType: string;
  english: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.date = utc(obj.datetime);
    this.actor = obj.actor || '';
    this.actorType = obj.actor_type || '';
    this.action = obj.action || '';
    this.actedUpon = obj.acted_upon || '';
    this.actedUponType = obj.acted_upon_type || '';
    this.associatedWith = obj.associated_with || '';
    this.associatedWithType = obj.associated_with_type || '';
    this.english = obj.english || '';
  }
}
