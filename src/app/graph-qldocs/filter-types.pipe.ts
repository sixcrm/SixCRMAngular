import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSearchItems'
})
export class FilterSearchItemsPipe implements PipeTransform {

  transform(children: string[], filterString: string): string[] {
    if (!children || children.length === 0) return [];
    if (!filterString) return children;

    let fs = filterString.toUpperCase();

    return children.filter(child => child.toUpperCase().indexOf(fs) !== -1);
  }

}
