import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class CustomBlock {
  id: string;
  title: string;
  body: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.title = obj.title;
    this.body = obj.body;
  }

  inverse(): any {
    return {
      id: this.id,
      title: this.title,
      body: this.body
    }
  }
}

export class EmailTemplateSettings {
  colorPrimary: string;
  colorSecondary: string;
  colorTertiary: string;
  customBlocks: CustomBlock[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.colorPrimary = obj.color_primary || '';
    this.colorSecondary = obj.color_secondary || '';
    this.colorTertiary = obj.color_tertiary || '';
    this.customBlocks = (obj.custom_blocks || []).map(cb => new CustomBlock(cb));
  }

  inverse(): any {
    return {
      color_primary: this.colorPrimary,
      color_secondary: this.colorSecondary,
      color_tertiary: this.colorTertiary,
      custom_blocks: this.customBlocks.map(cb => cb.inverse())
    }
  }
}

export class AccountDetails implements Entity<AccountDetails> {
  id: string;
  companyLogo: string;
  supportLink: string;
  supportPhone: string;
  supportEmail: string;
  emailTemplateSettings: EmailTemplateSettings;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.companyLogo = obj.company_logo || '';
    this.supportLink = obj.support_link || '';
    this.supportPhone = obj.support_phone || '';
    this.supportEmail = obj.support_email || '';
    this.emailTemplateSettings = new EmailTemplateSettings(obj.emailtemplatesettings);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): AccountDetails {
    return new AccountDetails(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      company_logo: this.companyLogo,
      support_link: this.supportLink,
      support_phone: this.supportPhone,
      support_email: this.supportEmail,
      emailtemplatesettings: this.emailTemplateSettings.inverse(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
