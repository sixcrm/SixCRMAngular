import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';

export class SmtpProvider implements Entity<SmtpProvider> {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  username: string;
  password: string;
  port: string;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.hostname = obj.hostname || '';
    this.ipAddress = obj.ip_address || '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.port = obj.port || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): SmtpProvider {
    return new SmtpProvider(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      hostname: this.hostname,
      ip_address: this.ipAddress,
      username: this.username,
      password: this.password,
      port: this.port,
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAt.clone().format()
    }
  }
}
