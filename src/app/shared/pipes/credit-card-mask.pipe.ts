import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardMask'
})
export class CreditCardMaskPipe implements PipeTransform {

  transform(value: string, mask: boolean, mode: string): any {
    if (!value) return '';
    if (!mask) return value;

    let ccv: boolean = mode === 'ccv';

    if (ccv || value.length < 13) {
      return Array(value.length + 1).join('*');
    }

    return Array(13).join('*') + value.substr(12, value.length);
  }

}
