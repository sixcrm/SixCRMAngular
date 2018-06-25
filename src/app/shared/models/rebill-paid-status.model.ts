import {Moment, utc} from 'moment'

export class RebillPaidStatus {
  detail: string;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.detail = obj.detail || '';
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): RebillPaidStatus {
    return new RebillPaidStatus(this.inverse());
  }

  inverse(): any {
    return {
      detail: this.detail,
      updated_at: this.updatedAt.clone().format()
    }
  }

}
