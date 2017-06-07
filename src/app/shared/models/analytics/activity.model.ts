import {Moment, utc} from 'moment';

export class Activity {
  id: string;
  date: Moment;
  actor: string;
  actor_type: string;
  action: string;
  acted_upon: string;
  acted_upon_type: string;
  associated_with: string;
  associated_with_type: string;
  english: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.date = utc(obj.datetime);
    this.actor = obj.actor || '';
    this.actor_type = obj.actor_type || '';
    this.action = obj.action || '';
    this.acted_upon = obj.acted_upon || '';
    this.acted_upon_type = obj.acted_upon_type || '';
    this.associated_with = obj.associated_with || '';
    this.associated_with_type = obj.associated_with_type || '';
    this.english = obj.english || '';
  }

  parse(): string {
    let data = JSON.parse(this.english);
    let sentence = data.english_template;

    sentence = sentence.replace(`{action}`, this.action);

    Object.keys(data).forEach(key => {
      sentence = sentence.replace(`{${key}}`, this.getString(data[key]));
    });

    return sentence;
  }

  private getString(data: any) {
    if (!data) return '';
    if (data.user) return data.user;
    if (data.firstName || data.lastName) return data.firstName + ' ' + data.lastName;
    if (data.email) return data.email;

    return data.id;
  }
}
