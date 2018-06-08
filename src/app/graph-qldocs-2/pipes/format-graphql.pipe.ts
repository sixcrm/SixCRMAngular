import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatGraphQl'
})
export class FormatGraphQlPipe implements PipeTransform {

  tab = '  ';

  transform(text: string): string {

    let result = '';
    let tabCounter = 0;

    if (!text) return result;

    for (let c of text) {
      if (c === '{' || c === '(') {
        tabCounter++;
        result += c + '\n' + this.tabs(tabCounter)
      } else if (c === '}' || c === ')') {
        tabCounter--;
        result += '\n' + this.tabs(tabCounter) + c
      } else if (c === ',') {
        result += c +'\n' + this.tabs(tabCounter)
      } else {
        result += c;
      }
    }

    return result;
  }

  tabs(count: number) {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += this.tab;
    }

    return result;
  }

}
