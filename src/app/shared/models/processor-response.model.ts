import {Entity} from './entity.interface';

export class ProcessorResponse implements Entity<ProcessorResponse> {
  id: string;
  message: string;
  code: string;
  authCode: string;
  responseText: any = {};
  transactionId: string;

  constructor(obj?: any) {
    if (obj) {
      obj = JSON.parse(obj);

      this.message = obj.message || '';
      this.code = obj.code || '';

      if (obj.result) {
        this.responseText = obj.result.response || {};
        this.authCode = obj.result.authcode || '';
        this.transactionId = obj.result.transactionid || '';
      }
    }
  }

  getCard(): {brand?: string, last4?: string} {
    if (!this.responseText || !this.responseText.body || !this.responseText.body.source || !this.responseText.body.source.card) {
      return {}
    }

    return this.responseText.body.source.card;
  }

  copy(): ProcessorResponse {
    return new ProcessorResponse(this.inverse());
  }

  inverse(): any {
    return JSON.stringify({
      id: this.id,
      message: this.message,
      code: this.code,
      result: {
        response: this.responseText,
        authcode: this.authCode,
        transactionid: this.transactionId
      }
    })
  }
}
