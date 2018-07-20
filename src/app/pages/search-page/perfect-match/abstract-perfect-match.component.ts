import {Input} from '@angular/core'
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

export abstract class AbstractPerfectMatch {

  _id: string;

  @Input() set id(value: string) {
    this._id = value;
    this.fetchPerfect();
  }

  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();
  serverError: CustomServerError;

  destroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  abstract fetchPerfect(): void;
}
