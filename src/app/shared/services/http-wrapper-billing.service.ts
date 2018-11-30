import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {CreditCard} from '../models/credit-card.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {stateCode, countryCode} from '../utils/address.utils';

@Injectable()
export class HttpWrapperBillingService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  public restoreAccount(creditCard?: CreditCard): Observable<any> {
    let body = null;

    if (creditCard) {
      body = {
        'creditcard': {
          'number': creditCard.ccnumber,
          'expiration': creditCard.expiration,
          'cvv': creditCard.cvv,
          'name': creditCard.name,
          'address': {
            'line1': creditCard.address.line1,
            'city': creditCard.address.city,
            'state': stateCode(creditCard.address.state),
            'zip': creditCard.address.zip,
            'country': countryCode(creditCard.address.country),
          }
        }
      };

      if (creditCard.address.line2) {
        body.creditcard.address['line2'] = creditCard.address.line2;
      }
    }

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.auth.getToken());

    const endpoint = environment.bareEndpoint + `account/restore/` + this.auth.getActiveAcl().account.id;

    return this.http.post<any>(endpoint, body, {observe: 'response', responseType: 'json', headers: headers})
      .map(response => response.body.response);
  }

}
