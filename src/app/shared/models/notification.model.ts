export class Notification {
  id: string;
  type: string;
  action: string;
  message: string;
  readAt: string;
  createdAt: string;
  updatedAt: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.type = obj.type || '';
    this.action = obj.action || '';
    this.message = obj.message || '';
    this.readAt = obj.read_at || '';
    this.createdAt = obj.created_at || '';
    this.updatedAt = obj.updated_at || '';
  }
}
