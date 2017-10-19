import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textMask'
})
export class TextMaskPipe implements PipeTransform {

  transform(value: string, mask: boolean, visibleCount: number): any {
    if (!value) return '';
    if (!mask) return value;

    const length = value.length;
    const toMask = length > visibleCount ? length - visibleCount : 0;

    return Array(toMask).join('*') + value.substr(toMask, value.length);
  }

}
