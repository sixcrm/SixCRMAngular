import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {sign} from 'jsonwebtoken';
import {environment} from '../../../environments/environment';
import {getCustomerJwtQuery, getCustomerSession} from '../utils/queries/customer-graph.queries';
import {Session} from '../models/session.model';
import {Observable, Subject} from 'rxjs';
import {Customer} from '../models/customer.model';
import {updateCustomerMutation} from '../utils/queries/entities/customer.queries';
import {CreditCard} from '../models/credit-card.model';
import {
  createCreditCardMutation, updateCreditCardPartialMutation, deleteCreditCardMutation
} from '../utils/queries/entities/credit-card.queries';

@Injectable()
export class HttpWrapperCustomerService {

  private jwt: string;

  constructor(private http: HttpClient) { }

  public fetchSessionInfo(sessionId: string): Observable<Session> {
    let obs: Subject<Session> = new Subject();

    this.fetchJWT(sessionId).subscribe(token => {
      this.jwt = token;

      this.fetchSession(sessionId, token).subscribe(session => {
        obs.next(session);
      })
    });

    return obs;
  }

  public updateCustomerInfo(customer: Customer): Observable<Customer> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.jwt);

    const endpoint = environment.bareEndpoint + 'customergraph/3f4abaf6-52ac-40c6-b155-d04caeb0391f';

    return this.http.post<any>(endpoint, updateCustomerMutation(customer), {observe: 'response', responseType: 'json', headers: headers})
      .map(response => new Customer(response.body.response.data.updatecustomer));
  }

  public createCreditCard(creditCard: CreditCard): Observable<CreditCard> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.jwt);

    const endpoint = environment.bareEndpoint + 'customergraph/3f4abaf6-52ac-40c6-b155-d04caeb0391f';

    return this.http.post<any>(endpoint, createCreditCardMutation(creditCard), {observe: 'response', responseType: 'json', headers: headers})
      .map(response => new CreditCard(response.body.response.data.createcreditcard));
  }

  public deleteCreditCard(creditCard: CreditCard): Observable<CreditCard> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.jwt);

    const endpoint = environment.bareEndpoint + 'customergraph/3f4abaf6-52ac-40c6-b155-d04caeb0391f';

    return this.http.post<any>(endpoint, deleteCreditCardMutation(creditCard.id), {observe: 'response', responseType: 'json', headers: headers})
      .map(response => new CreditCard(response.body.response.data.deletecreditcard));
  }

  public updateCreditCard(creditCard: CreditCard): Observable<CreditCard> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.jwt);

    const endpoint = environment.bareEndpoint + 'customergraph/3f4abaf6-52ac-40c6-b155-d04caeb0391f';

    return this.http.post<any>(endpoint, updateCreditCardPartialMutation(creditCard), {observe: 'response', responseType: 'json', headers: headers})
      .map(response =>  new CreditCard(response.body.response.data.updatecreditcardpartial));
  }

  private fetchSession(sessionId: string, customerToken: string): Observable<Session> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', customerToken);

    const endpoint = environment.bareEndpoint + 'customergraph/3f4abaf6-52ac-40c6-b155-d04caeb0391f';

    return this.http.post<any>(endpoint, getCustomerSession(sessionId), {observe: 'response', responseType: 'json', headers: headers})
      .map(response => new Session(response.body.response.data.session));
  }

  private fetchJWT(sessionId: string): Observable<string> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.generateJWT());

    const endpoint = environment.endpoint + '3f4abaf6-52ac-40c6-b155-d04caeb0391f';

    return this.http.post<any>(endpoint, getCustomerJwtQuery(sessionId), {observe: 'response', responseType: 'json', headers: headers})
      .map(response => response.body.response.data.getcustomerjwt.token);
  }

  private generateJWT() {
    const now = Math.floor(Date.now() / 1000);
    const body = {
      "email": "accounting.customer.selfservice@sixcrm.com",
      "email_verified": true,
      "picture": "",
      "iss": "https://sixcrm.auth0.com/",
      "sub": "",
      "aud": "",
      "exp": (now + 3600),
      "iat": now
    };
    const signingKey = '4K2VAY6MLHW6JAJHJQ9L';

    return sign(body, signingKey);
  }

}
