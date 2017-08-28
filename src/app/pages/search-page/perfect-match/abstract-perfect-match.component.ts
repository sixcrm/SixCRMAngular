import {Input} from '@angular/core'
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

export class AbstractPerfectMatch {

  @Input() id: string;
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();
  serverError: CustomServerError;

  destroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
