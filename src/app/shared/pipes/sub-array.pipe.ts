import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subArray'
})
export class SubArrayPipe implements PipeTransform {

  transform(values: any[], maxCount: number): any[] {
    if (!values || !values.length || maxCount === 0) return [];

    let count = values.length <= maxCount ? values.length : maxCount;

    return values.slice(0, count);
  }

}
