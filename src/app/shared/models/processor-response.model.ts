import {Entity} from './entity.interface';

export class ProcessorResponse implements Entity<ProcessorResponse> {
  id: string;
  message: string;
  body: string;
  code: string;
  response: any = {};

  originalResponse: any;

  constructor(obj?: any) {
    this.originalResponse = obj;

    if (obj) {
      obj = JSON.parse(obj);

      this.message = obj.message || '';
      this.code = obj.code || '';
      this.body = obj.merchant_message || '';

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

  getCard(): {brand?: string, last4?: string} {
    if (!this.response || !this.response.body || !this.response.body.source || !this.response.body.source.card) {
      return {}
    }

    return this.response.body.source.card;
  }

  copy(): ProcessorResponse {
    return new ProcessorResponse(this.originalResponse);
  }

  inverse(): any {
    return this.originalResponse;
  }
}
