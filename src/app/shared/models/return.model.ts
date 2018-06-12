import {ReturnHistoryItem} from './return-history-item.model';
import {utc, Moment} from 'moment';

export class Return {
  id: string;
  alias: string;
  history: ReturnHistoryItem[] = [];
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.alias = obj.alias || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

    if (obj.history) {
      this.history = obj.history.map(h => new ReturnHistoryItem(h));
    }
  }

  copy(): Return {
    return new Return(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      alias: this.alias,
      history: this.history.map(h => h.inverse()),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
