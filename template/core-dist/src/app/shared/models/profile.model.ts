export class Profile {

  picture: string;
  email: string;
  createdAt: string;
  firstName: string;
  lastName: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.picture = obj.picture || '';
    this.email = obj.email || '';
    this.createdAt = obj.created_at || '';
    this.firstName = obj.given_name || '';
    if (!this.firstName) {
      this.firstName = obj.name || '';
    }
    this.lastName = obj.family_name || '';
  }

  copy(): Profile {
    return new Profile({
      picture: this.picture,
      email: this.email,
      created_at: this.createdAt,
      given_name: this.firstName,
      lastName: this.lastName
    })
  }
}
