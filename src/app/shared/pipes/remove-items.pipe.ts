import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeItems'
})
export class RemoveItemsPipe implements PipeTransform {

  transform(items: any[], toRemove: any[], itemsMapper: (any) => string, toRemoveMapper: (any) => string): any {
    if (!items || items.length === 0) return [];
    if (!toRemove || toRemove.length === 0) return items;

    if (!itemsMapper) {
      itemsMapper = (el) => el;
    }

    if (!toRemoveMapper) {
      toRemoveMapper = (el) => el;
    }

    const parsedToRemove = toRemove.map(r => (toRemoveMapper(r) || '').toLowerCase());

    return items.filter(item => {
      const parsedItem = (itemsMapper(item) || '').toLowerCase();

      return !parsedToRemove.some(ptr => ptr === parsedItem);
    })
  }

}
