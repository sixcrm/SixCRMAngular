import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class TrialConfirmation implements Entity<TrialConfirmation> {

  id: string;
  code: string;
  confirmed_at: Moment;
  delivered_at: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.code = obj.code || '';
    this.delivered_at = obj.delivered_at ? utc(obj.delivered_at) : null;
    this.confirmed_at = obj.confirmed_at ? utc(obj.confirmed_at) : null;
  }

  copy(): TrialConfirmation {
    return new TrialConfirmation(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      code: this.code,
      confirmed_at: this.confirmed_at,
      delivered_at: this.delivered_at
    }
  }
}
