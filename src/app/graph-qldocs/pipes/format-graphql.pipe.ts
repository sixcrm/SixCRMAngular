import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatGraphQl'
})

export class FormatGraphQlPipe implements PipeTransform {
  tab = '  ';
  result = '';
  tabCounter = 0;

  transform(text: string): string {
    this.result = '';
    this.tabCounter = 0;

    if (!text) return this.result;

    for (let i = 0; i < text.length; i++) {
      let c = text[i];
      switch (c) {
        case '(':
        case '{': {
          this.openBracket(c);
          break;
        }
        case '}': {
          this.closedCurlyBracket(c, text[i+1], text[i+2]);
          break;
        }
        case ')': {
          this.closedBracket(c);
          break;
        }
        case ',': {
          this.result += c + '\n' + this.tabs(this.tabCounter);
          break;
        }
        case ' ':{
          if (text[i-1] !== '(' && text[i-1] !== '{') {
            this.result += c;
          }
          break;
        }
        default: {
          this.result += c;
        }
      }
    }

    return this.result;
  }

  openBracket(c: string) {
    this.tabCounter++;
    this.result += c + '\n' + this.tabs(this.tabCounter);
  }

  closedBracket(c: string) {
    this.tabCounter--;
    this.result += '\n' + this.tabs(this.tabCounter) + c;
  }

  closedCurlyBracket(c: string, next: string, nextButOne: string) {
    this.tabCounter--;
    this.result += '\n' + this.tabs(this.tabCounter) + c;

    if (next !== ',' && next !== ']' && nextButOne !== ']') {
      if (next !== ')' && next !== '}' && (next !== ' ' && nextButOne !== '}')) {
        this.result += '\n';
      }
      this.result += this.tabs(this.tabCounter);
    }
  }

  tabs(count: number) {
    let tabs = '';
    for (let i = 0; i < count; i++) {
      tabs += this.tab;
    }

    return tabs;
  }

}
