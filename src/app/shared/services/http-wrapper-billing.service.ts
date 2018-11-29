import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {CreditCard} from '../models/credit-card.model';
import {AuthenticationService} from '../../authentication/authentication.service';

@Injectable()
export class HttpWrapperBillingService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  public restoreAccount(creditCard?: CreditCard): Observable<any> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.auth.getToken());

    const endpoint = environment.bareEndpoint + `account/restore/` + this.auth.getActiveAcl().account.id;

    return this.http.post<any>(endpoint, null, {observe: 'response', responseType: 'json', headers: headers})
      .map(response => response.body.response);
  }

}
