import { Pipe, PipeTransform } from '@angular/core';
import {Type} from './models/type.model';

@Pipe({
  name: 'filterTypes'
})
export class FilterTypesPipe implements PipeTransform {

  transform(types: Type[], filterString: string): Type[] {
    if (!types || types.length === 0) return [];
    if (!filterString) return types;

    let fs = filterString.toUpperCase();

    return types.filter(type => type.name.toUpperCase().indexOf(fs) !== -1);
  }

}
