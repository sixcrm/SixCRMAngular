export class ProcessorResponse {
  message: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    obj = JSON.parse(obj);
    this.message = obj.message || '';
  }
}
