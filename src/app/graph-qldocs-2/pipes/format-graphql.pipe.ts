import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatGraphQl'
})
export class FormatGraphQlPipe implements PipeTransform {

  tab = '  ';
  result = '';
  tabCounter = 0;
  bracketCounter = 0;
  wrap = '';
  addLastBracket = false;

  transform(text: string): string {
    this.result = '';
    this.bracketCounter = 0;
    this.tabCounter = 0;
    this.addLastBracket = false;

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
          this.closedCurlyBracket(c);
          break;
        }
        case ')': {
          this.closedBracket(c, text[i+1]);
          break;
        }
        case ',': {
          this.result += c + '\n' + this.tabs(this.tabCounter);
          break;
        }
        default: {
          this.result += c;
        }
      }
    }

    if (this.addLastBracket) {
      this.result += '\n' + '}';
    }

    return this.result;
  }

  openBracket(c: string) {
    this.tabCounter++;
    this.result += c + '\n' + this.tabs(this.tabCounter);
  }

  closedBracket(c: string, next: string) {
    this.tabCounter--;
    this.addWrap();

    this.result += '\n' + this.tabs(this.tabCounter) + c + this.wrap;

    if (next !== ',') {
      this.result += '\n' + this.tabs(this.tabCounter);
    }
  }

  closedCurlyBracket(c: string) {
    this.tabCounter--;
    this.result += '\n ' + this.tabs(this.tabCounter) + c + '\n' + this.tabs(this.tabCounter);
  }

  addWrap() {
    this.wrap = '';
    this.bracketCounter--;
    if (!this.addLastBracket && this.bracketCounter === 0) {
      this.wrap = ' {';
      this.addLastBracket = true;
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
