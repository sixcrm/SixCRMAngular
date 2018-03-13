import { Pipe, PipeTransform } from '@angular/core';
import {EventHook} from '../../shared/models/event-hook.model';

@Pipe({
  name: 'filterHooksByType'
})
export class FilterHooksByTypePipe implements PipeTransform {

  transform(hooks: EventHook[], type: string): any {
    if (!hooks || hooks.length === 0) return [];

    if (!type) return hooks;

    return hooks.filter(t => t.eventType === type);
  }

}
