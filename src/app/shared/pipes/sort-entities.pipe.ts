import { Pipe, PipeTransform } from '@angular/core';
import {utc} from 'moment'

@Pipe({
  name: 'sortEntities'
})
export class SortEntitiesPipe implements PipeTransform {

  transform(entities: any[], mapToField: (entity: any) => string, order?: string): any {
    if (!mapToField) return entities;

    let ord = order || 'asc';

    return entities.sort((f, s) => {
      const first = mapToField(f).toString().toUpperCase();
      const second = mapToField(s).toString().toUpperCase();

      const firstTime = utc(first);
      const secondTime = utc(second);

      if (firstTime.isValid() && secondTime.isValid()) {


        if (firstTime.isBefore(secondTime)) {
          return  ord === 'asc' ? -1 : 1;
        }

        if (secondTime.isBefore(firstTime)) {
          return ord === 'asc' ? 1 : -1;
        }

        return 0;

      } else {

        if (first < second) {
          return ord === 'asc' ? -1 : 1;
        }

        if (first > second) {
          return ord === 'asc' ? 1 : -1;
        }

        return 0;

      }
    });
  }

}
