import {Entity} from './entity.interface';

export class ProcessorResponse implements Entity<ProcessorResponse> {
  id: string;
  message: string;
  body: any;
  code: string;
  response: any = {};

  originalResponse: any;

  constructor(obj?: any) {
    this.originalResponse = obj;

    if (obj) {
      obj = JSON.parse(obj);

      this.message = obj.message || '';
      this.code = obj.code || '';

      if (obj.result) {
        this.response = obj.result.response || {};
      } else if (obj.vendorresponse) {
        this.response = obj.vendorresponse;
      }

      if (this.code === 'success') {
        this.body = this.message;
      } else if (obj.body) {
        this.body = obj.body;
      } else if (this.response) {
        this.body = this.response.body;
      }
    }
  }

  copy(): ProcessorResponse {
    return new ProcessorResponse(this.originalResponse);
  }

  inverse(): any {
    return this.originalResponse;
  }
}
