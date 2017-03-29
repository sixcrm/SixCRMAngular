import {Entity} from './entity.interface';

export class ProcessorResponse implements Entity<ProcessorResponse> {
  id: string = '';
  message: string = '';

  constructor(obj?: any) {
    if (obj) {
      obj = JSON.parse(obj);
      this.message = obj.message || '';
    }
  }

  copy(): ProcessorResponse {
    return null;
  }
}
