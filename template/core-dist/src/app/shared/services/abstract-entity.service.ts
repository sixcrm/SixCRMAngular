import {Headers, Response, Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export abstract class AbstractEntityService {

  constructor(private http: Http, private authService: AuthenticationService) {};

  public abstract deleteEntity(id: string): void;

  public abstract editEntity(entity: any): void;

  protected queryRequest(query: string): Observable<Response> {
    return this.http.post(environment.endpoint, query, { headers: this.generateHeaders()});
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }
}
