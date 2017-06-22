import { Pipe, PipeTransform } from '@angular/core';
import {ColumnParams} from '../models/column-params.model';

@Pipe({
  name: 'filterEntitiesByParams'
})
export class FilterEntitiesByParamsPipe implements PipeTransform {

  transform(entities: any[], columnParams: ColumnParams<any>[], filterString: string): any {
    if (!entities || entities.length === 0 || !columnParams || columnParams.length === 0) return [];

    if (!filterString) return entities;

    let fs = filterString.toUpperCase();

    return entities.filter(entity =>
      columnParams.filter(param => param.mappingFunction(entity).toString().toUpperCase().indexOf(fs) !== -1).length > 0
    );
  }

}
