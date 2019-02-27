import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';

export class SmsProvider implements Entity<SmsProvider> {
  id: string;
  name: string;
  type: string;
  from: string;
  apiAccount: string;
  apiToken: string;
  fromNumber: string;

  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.type = obj.type || 'twilio';
    this.apiAccount = obj.api_account || '';
    this.apiToken = obj.api_token || '';
    this.fromNumber = obj.from_number || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): SmsProvider {
    return new SmsProvider(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      api_account: this.apiAccount,
      api_token: this.apiToken,
      from_number: this.fromNumber,
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAtAPI
    }
  }
}
