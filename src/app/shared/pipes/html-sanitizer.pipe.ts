import { Pipe, PipeTransform } from '@angular/core';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'htmlSanitizer'
})
export class HtmlSanitizerPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(htmlValue: string): SafeHtml {
    if (!htmlValue) return '';

    return this.sanitizer.bypassSecurityTrustHtml(htmlValue);
  }

}
