import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortEntities'
})
export class SortEntitiesPipe implements PipeTransform {

  transform(entities: any[], mapToField: (entity: any) => string, order?: string): any {
    if (!mapToField) return entities;

    let ord = order || 'asc';

    return entities.sort((f, s) => {
      let first = mapToField(f).toString().toUpperCase();
      let second = mapToField(s).toString().toUpperCase();

      if (first < second) {
        return  ord === 'asc' ? -1 : 1;
      }

      if (first > second) {
        return ord === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

}
