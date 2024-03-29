import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';

export class SmtpProvider implements Entity<SmtpProvider> {
  id: string;
  name: string;
  fromName: string;
  fromEmail: string;
  hostname: string;
  username: string;
  password: string;
  port: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.fromEmail = obj.from_email || '';
    this.fromName = obj.from_name || '';
    this.hostname = obj.hostname || '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.port = obj.port || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): SmtpProvider {
    return new SmtpProvider(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      from_email: this.fromEmail,
      from_name: this.fromName,
      hostname: this.hostname,
      username: this.username,
      password: this.password,
      port: this.port,
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAtAPI
    }
  }
}
