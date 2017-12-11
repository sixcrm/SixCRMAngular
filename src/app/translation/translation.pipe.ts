import { Pipe, PipeTransform } from '@angular/core';
import {TranslationService} from './translation.service';

@Pipe({
  name: 'translate'
})
export class TranslationPipe implements PipeTransform {

  constructor(private translationService: TranslationService) {};

  transform(value: string): any {
    return this.translationService.translate(value);
  }

}
