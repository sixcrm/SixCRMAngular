import { Pipe, PipeTransform } from '@angular/core';
import {ColumnParams} from '../models/column-params.model';

@Pipe({
  name: 'filterEntitiesByField'
})
export class FilterEntitiesByFieldPipe implements PipeTransform {

  transform(entities: any[], field: string, value: string): any {
    if (!entities || entities.length === 0) return [];

    if (!field) return entities;

    if (!value) return entities;

    return entities.filter(entity => entity[field] === value);
  }

}
