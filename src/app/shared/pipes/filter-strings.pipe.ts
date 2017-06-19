import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStrings'
})
export class FilterStringsPipe implements PipeTransform {

  transform(strings: string[], filterString: string): string[] {
    if (!strings || strings.length === 0) return [];
    if (!filterString) return strings;

    let fs = filterString.toUpperCase();

    return strings.filter(s => s.toUpperCase().indexOf(fs) !== -1);
  }

}
