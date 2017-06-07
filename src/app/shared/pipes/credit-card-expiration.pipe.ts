import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardExpiration'
})
export class CreditCardExpirationPipe implements PipeTransform {

  transform(value: string): string {
    if (!value || value.length !== 4) return value;

    return value.substr(0, 2) + '/' + value.substr(2, 4);
  }

}
