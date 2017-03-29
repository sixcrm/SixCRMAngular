import {Entity} from './entity.interface';

export class SmtpProvider implements Entity<SmtpProvider> {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  username: string;
  password: string;
  port: string;

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
  }

  copy(): SmtpProvider {
    return null;
  }
}
