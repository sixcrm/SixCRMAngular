import {Moment, utc} from 'moment';
import {User} from './user.model';

export class SessionCancelation {

  cancelled: boolean;
  cancelledAt: Moment;
  cancelledBy: User;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.cancelled = !!obj.cancelled;
    this.cancelledAt = utc(obj.cancelled_at);
    this.cancelledBy = new User(obj.cancelled_by);
  }

  copy(): SessionCancelation {
    return new SessionCancelation(this.inverse())
  }

  inverse(): any {
    return {
      cancelled: this.cancelled,
      cancelled_at: this.cancelledAt.clone(),
      cancelled_by: this.cancelledBy.inverse()
    }
  }
}
