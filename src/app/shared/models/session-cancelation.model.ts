import {Moment, utc} from 'moment';
import {User} from './user.model';

export class SessionCancelation {

  canceled: boolean;
  canceledAt: Moment;
  canceledBy: User;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.canceled = obj.canceled;
    this.canceledAt = utc(obj.canceled_at);
    this.canceledBy = new User(obj.canceled_by);
  }

  copy(): SessionCancelation {
    return new SessionCancelation(this.inverse())
  }

  inverse(): any {
    return {
      canceled: this.canceled,
      canceled_at: this.canceledAt.clone(),
      canceled_by: this.canceledBy.inverse()
    }
  }
}
