import {Entity} from './entity.interface';

export class ProcessorResponse implements Entity<ProcessorResponse> {
  id: string = '';
  message: string = '';
  authCode: string = '';
  responseText: string = '';
  transactionId: string = '';

  constructor(obj?: any) {
    if (obj) {
      obj = JSON.parse(obj);
      this.message = obj.message || '';

      if (obj.results) {
        this.responseText = obj.results.responsetext || '';
        this.authCode = obj.results.authcode || '';
        this.transactionId = obj.results.transactionid || '';
      }
    }
  }

  copy(): ProcessorResponse {
    return null;
  }
}
