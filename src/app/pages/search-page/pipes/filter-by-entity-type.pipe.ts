import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByEntityType'
})
export class FilterByEntityTypePipe implements PipeTransform {

  transform(hits: any[], entityType: string): any[] {
    if (!entityType) return hits;

    if (!hits || hits.length === 0) return [];

    return hits.filter(h => h.fields.entity_type === entityType);
  }

}
