import {Moment} from 'moment';

export interface FilterTerm {
  id: string;
  label: string;
  type: string;
}

export function flatDown(m: Moment) { return m.hours(0).minutes(0).seconds(0).millisecond(0) }
export function flatUp(m: Moment) { return m.hours(23).minutes(59).seconds(59)}