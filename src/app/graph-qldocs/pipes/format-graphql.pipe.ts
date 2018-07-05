import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatGraphQl'
})

export class FormatGraphQlPipe implements PipeTransform {
  tab = '  ';
  result = '';
  tabCounter = 0;
  bracketCounter = 0;

  transform(text: string): string {
    this.result = '';
    this.bracketCounter = 0;
    this.tabCounter = 0;

    if (!text) return this.result;

    for (let i = 0; i < text.length; i++) {
      let c = text[i];
      switch (c) {
        case '(': {
          this.bracketCounter++;
          this.openBracket(c);
          break;
        }
        case '{': {
          this.openBracket(c);
          break;
        }
        case '}': {
          this.closedCurlyBracket(c, text[i+1]);
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

  closedCurlyBracket(c: string, next: string) {
    this.tabCounter--;
    this.result += '\n' + this.tabs(this.tabCounter) + c;

    if (next !== ',') {
      if (next !== ')') {
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
