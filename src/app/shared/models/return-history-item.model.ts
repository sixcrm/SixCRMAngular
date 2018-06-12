import { utc, Moment } from 'moment';

export class ReturnHistoryItem {
  state: string;
  createdAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.state = obj.state || '';
    this.createdAt = utc(obj.created_at);
  }

  copy(): ReturnHistoryItem {
    return new ReturnHistoryItem(this.inverse())
  }

  inverse(): any {
    return {
      state: this.state,
      created_at: this.createdAt.format()
    }
  }
}
