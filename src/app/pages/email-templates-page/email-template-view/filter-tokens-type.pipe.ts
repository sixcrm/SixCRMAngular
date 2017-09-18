import { Pipe, PipeTransform } from '@angular/core';
import {Token} from './token-list/token-list.component';

@Pipe({
  name: 'filterTokensType'
})
export class FilterTokensTypePipe implements PipeTransform {

  transform(tokens: Token[], path: string, strict?: boolean): any {
    if (!path) return tokens;

    return tokens.filter(t => strict ? t.path === path : t.path.indexOf(path) !== -1);
  }

}
