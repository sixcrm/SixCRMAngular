import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterChipsPipe'
})
export class FilterChipsPipePipe implements PipeTransform {

  transform(values: any[], chips: string[], mapper: (el: any) => string): any {
    if (!values || values.length === 0) return [];
    if (!chips || chips.length === 0) return values;

    if (!mapper) {
      mapper = (el) => el;
    }

    const parsedChips = chips.map(c => c.toLowerCase());

    return values.filter(value => {
      const parsedValue = (mapper(value) || '').toLowerCase();

      return parsedChips.some(chip => parsedValue.indexOf(chip) !== -1);
    })
  }

}
