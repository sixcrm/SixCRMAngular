import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardFormat'
})
export class CreditCardFormatPipe implements PipeTransform {

  transform(number: string, showMask?: boolean): any {
    let lastFour = number.substr(number.length - 4);
    let prefix = '**** **** **** ';

    return showMask ? prefix + lastFour : lastFour;
  }

}
