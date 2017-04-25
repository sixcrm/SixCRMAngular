import { Pipe, PipeTransform } from '@angular/core';
import {isMoment} from 'moment';

@Pipe({
  name: 'filterEntities'
})
export class FilterEntitiesPipe implements PipeTransform {

  transform(entities: any[], filter: string): any[] {
    if (!filter) return entities;

    return entities.filter(entity => containsValue(entity, filter))
  }

}

function containsValue(obj: any, value: string): boolean {
  if (!obj || !value || typeof obj === 'function') return false;

  if (isMoment(obj)) {
    if (isSubstring(obj.format(), value)) return true;
  }
  else if (typeof obj === 'object') {
    for (let key in obj) {
      if (containsValue(obj[key], value)) return true;
    }
  } else if (isSubstring(obj.toString(), value)) return true;

  return false;
}

function isSubstring(str: any, substr: string): boolean {
  return str.toLowerCase().indexOf(substr.toLowerCase()) !== -1;
}
