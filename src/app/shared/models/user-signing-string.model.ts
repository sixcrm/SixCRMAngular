import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class UserSigningString implements Entity<UserSigningString> {
  id: string;
  user: string;
  name: string;
  signingString: string;
  usedAt: Moment;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.user = obj.user || '';
    this.name = obj.name || '';
    this.signingString = obj.signing_string || '';
    this.usedAt = obj.used_at ? utc(obj.used_at) : null;
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): UserSigningString {
    return new UserSigningString(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      user: this.user,
      signing_string: this.signingString,
      used_at: this.usedAt ? this.usedAt.format() : null,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
