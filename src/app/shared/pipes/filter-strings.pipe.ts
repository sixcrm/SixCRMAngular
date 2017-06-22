import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStrings'
})
export class FilterStringsPipe implements PipeTransform {

  transform(strings: string[], filterString: string, mapFunction): string[] {
    if (!strings || strings.length === 0 || !mapFunction) return [];
    if (!filterString) return strings;

    let fs = filterString.toUpperCase();

    return strings.filter(s => mapFunction(s).toUpperCase().indexOf(fs) !== -1);
  }

}
