import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSimple'
})
export class FilterSimplePipe implements PipeTransform {

  transform(values: any[], mapper: (any) => boolean, filterString: string): any {
    if (!values || values.length === 0) return [];
    if (!mapper) return [];

    return values.filter(mapper);
  }

}
