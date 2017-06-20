import {SmtpProvider} from './smtp-provider.model';
import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';

export class EmailTemplate implements Entity<EmailTemplate> {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  createdAt: Moment;
  updatedAt: Moment;
  smtpProvider: SmtpProvider;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.subject = obj.subject || '';
    this.body = obj.body || '';
    this.type = obj.type || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.smtpProvider = new SmtpProvider(obj.smtp_provider);
  }

  copy(): EmailTemplate {
    return new EmailTemplate(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      subject: this.subject,
      body: this.body,
      type: this.type,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      smtp_provider: this.smtpProvider.inverse()
    }
  }
}
