import {utc, Moment} from 'moment';

export class RebillStateHistory {
  state: string;
  enteredAt: Moment;
  exitedAt: Moment;
  errorMessage: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.state = obj.state || '';
    this.enteredAt = obj.entered_at ? utc(obj.entered_at) : null;
    this.exitedAt = obj.exited_at ? utc(obj.exited_at) : null;
    this.errorMessage = obj.error_message || '';
  }
}
