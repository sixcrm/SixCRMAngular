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

  hasPermission(entity: string, operation: string): boolean {
    let allowed = this.getFromAllowed(entity);

    if (!allowed) {
      return false;
    }

    let op = allowed.split('/')[1];

    if (operation === op || op === '*') {
      return true;
    }

    if (operation === 'view' && (op === 'view' || op === 'read' || op === 'write' || op === '*')) {
      return true;
    }

    if (operation === 'read' && (op === 'read' || op === 'write' || op === '*')) {
      return true;
    }

    if (operation === 'write' && (op === 'write' || op === '*')) {
      return true;
    }

    return false;
  }

  private getFromAllowed(entity: string): string {
    let allowed = this.allow.filter(a => a.indexOf(entity + '/') !== -1);

    return allowed[0] ? allowed[0] : null;
  }

  inverse(): any {
    return {
      id: this.id,
      allow: this.allow,
      deny: this.deny
    }
  }
}
