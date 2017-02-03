import {Headers} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';

export abstract class AbstractEntityService {

  constructor(private authService: AuthenticationService) {};

  protected generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }
}
