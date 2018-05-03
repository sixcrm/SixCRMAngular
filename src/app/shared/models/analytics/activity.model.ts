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
  activity_statement: string;
  parsed_statement: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = [];
    }

    this.id = Activity.getValueOf('id', obj) || '';
    this.date = utc(Activity.getValueOf('datetime', obj));
    this.actor = Activity.getValueOf('actor', obj) || '';
    this.actor_type = Activity.getValueOf('actor_type', obj) || '';
    this.action = Activity.getValueOf('action', obj) || '';
    this.acted_upon = Activity.getValueOf('acted_upon', obj) || '';
    this.acted_upon_type = Activity.getValueOf('acted_upon_type', obj) || '';
    this.associated_with = Activity.getValueOf('associated_with', obj) || '';
    this.associated_with_type = Activity.getValueOf('associated_with_type', obj) || '';
    this.activity_statement = Activity.getValueOf('activityStatement', obj) || {};

    this.parsed_statement = this.parse();

  }

  parse(): any {
    let data = this.activity_statement;
    let sentence = data.english_template;

    let parsedData = {};
    parsedData['{action}'] = {value: this.action};
    parsedData['{actor}'] = {value: this.getName(data, 'actor', this.actor_type), type: this.actor_type, id: this.actor};
    parsedData['{acted_upon}'] = {value: this.getName(data, 'acted_upon', this.acted_upon_type), type: this.acted_upon_type, id: this.acted_upon};
    parsedData['{associated_with}'] = {value: this.getName(data, 'associated_with', this.associated_with_type), type: this.associated_with_type, id: this.associated_with};

    return {template: sentence.slice(0, -1), values: parsedData};
  }

  private getName(data: any, type: string, entity_type: string): string {
    let info = data[type];

    if (!info) return '';

    if (entity_type === 'user') return info.id;
    if (entity_type === 'transaction') return info.alias;
    if (entity_type === 'creditcard') return 'credit card';
    if (entity_type === 'customer') return info.firstname + ' ' + info.lastname;
    if (info.name) return info.name;
    if (info.email) return info.email;

    return entity_type;
  }

  public static getValueOf(field, obj) {
    if (!obj.length) {
      obj = [];
    }

    let array = obj.filter(o => o.key === field);
    if (array.length > 0) {
      return array[0].value;
    }

    return '';
  }
}

export function compareActivities(f: Activity, s: Activity): number {
  if (f.date.isBefore(s.date)) {
    return 1;
  }

  if (f.date.isAfter(s.date)) {
    return -1;
  }

  return 0;
}
