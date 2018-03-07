import { Pipe, PipeTransform } from '@angular/core';
import {EmailTemplate} from '../../shared/models/email-template.model';

@Pipe({
  name: 'filterTemplatesByType'
})
export class FilterTemplatesByTypePipe implements PipeTransform {

  transform(templates: EmailTemplate[], type: string): any {
    if (!templates || templates.length === 0) return [];

    if (!type) return templates;

    return templates.filter(t => t.type === type);
  }

}
