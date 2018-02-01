import {Entity} from './entity.interface';

export class ProcessorResponse implements Entity<ProcessorResponse> {
  id: string;
  message: string;
  code: string;
  authCode: string;
  responseText: string;
  transactionId: string;

  constructor(obj?: any) {
    if (obj) {
      obj = JSON.parse(obj);

      this.message = obj.message || '';
      this.code = obj.code || '';

      if (obj.result) {
        this.responseText = obj.result.responsetext || '';
        this.authCode = obj.result.authcode || '';
        this.transactionId = obj.result.transactionid || '';
      }
    }
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
        responsetext: this.responseText,
        authcode: this.authCode,
        transactionid: this.transactionId
      }
    })
  }
}
