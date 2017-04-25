import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSearchResults'
})
export class FilterSearchResultsPipe implements PipeTransform {

  transform(values: any[], filter: string): any[] {
    if (!filter) return values;
    let filterLowerCase = filter.toLowerCase();

    return values.filter(value => {
      for (let key in value.fields) {
        if (value.fields[key].toLowerCase().indexOf(filterLowerCase) !== -1) {
          return true;
        }
      }
    })
  }

}
