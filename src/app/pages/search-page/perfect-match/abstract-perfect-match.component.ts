import {Input} from '@angular/core'
import {AsyncSubject} from 'rxjs';

export class AbstractPerfectMatch {

  @Input() id: string;
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  destroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
