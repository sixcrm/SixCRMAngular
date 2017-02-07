import {SmtpProvider} from './smtp-provider.model';

export class Email {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
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
    this.smtpProvider = new SmtpProvider(obj.smtp_provider);
  }
}
