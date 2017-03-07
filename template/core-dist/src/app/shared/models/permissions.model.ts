export class Permissions {

  id: string;
  allow: string[];
  deny: string[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.allow = obj.allow || [];
    this.deny = obj.deny || [];
  }

  // This function can be more efficient, but is written like this to be as descriptive as possible.
  hasPermission(entity: string, operation: string): boolean {
    let allowed = this.getFromAllowed(entity);

    // if entity is not in allowed list, user has no permissions on that entity
    if (!allowed) {
      return false;
    }

    let op = allowed.split('/')[1];

    // view is allowed if user has view, read, write or * (all) permissions
    if (operation === 'view' && (op === 'view' || op === 'read' || op === 'write' || op === '*')) {
      return true;
    }

    // read is allowed if user has read, write or * (all) permissions
    if (operation === 'read' && (op === 'read' || op === 'write' || op === '*')) {
      return true;
    }

    // write is allowed if user has write or * (all) permissions
    if (operation === 'write' && (op === 'write' || op === '*')) {
      return true;
    }

    // * (all) is allowed if user * (all) permissions
    if (operation === '*' && op === '*') {
      return true;
    }

    return false;
  }

  private getFromAllowed(entity: string): string {
    let allowed = this.allow.filter(a => a.indexOf(entity + '/') !== -1);

    return allowed[0] ? allowed[0] : '';
  }

  inverse(): any {
    return {
      id: this.id,
      allow: this.allow,
      deny: this.deny
    }
  }
}
