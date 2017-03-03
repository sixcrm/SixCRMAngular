export class AclRole {

  id: string;
  name: string;
  active: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.active = obj.active || '';
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      active: this.active
    }
  }
}
