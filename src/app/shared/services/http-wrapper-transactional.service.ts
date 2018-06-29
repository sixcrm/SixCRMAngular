import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {utc} from 'moment';
import {CheckoutBody, CheckoutAddress} from '../models/checkout-body.model';
import {Subject, Observable} from 'rxjs';
import {CheckoutResponse} from '../models/checkout-response.model';
import {TransactionalResponseError} from '../models/transactional-response-error.model';
import {CreditCard} from '../models/credit-card.model';
import {User} from '../models/user.model';
import {AccessKey} from '../models/access-key.model';

var sha1 = require('sha1');

@Injectable()
export class HttpWrapperTransactionalService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  checkout(checkoutBody: CheckoutBody, keys: AccessKey): Observable<CheckoutResponse | TransactionalResponseError> {
    let response: Subject<CheckoutResponse | TransactionalResponseError> = new Subject();

    const account = this.authService.getActiveAcl().account.id;
    const secret = keys.secretKey;
    const access = keys.accessKey;

    this.acquireToken(checkoutBody.campaign, account, secret, access).subscribe(acquireTokenResponse => {
      this.performCheckout(checkoutBody, acquireTokenResponse.body.response).subscribe(checkoutResponse => {
        response.next(new CheckoutResponse(checkoutResponse.body.response).withSuccess(checkoutResponse.body.response.result === "success"));
      }, error => response.next(new TransactionalResponseError(error.status, error.body ? error.body.message: error.message)))
    }, error => response.next(new TransactionalResponseError(error.status, error.body ? error.body.message: error.message)));

    return response;
  }

  paySixPlan(planId: string, creditCard: CreditCard, user: User): Observable<CheckoutResponse | TransactionalResponseError> {
    const campaignId = '8b60000e-6a6b-4807-94d1-f737da089ee5';
    const accessKey = '9X6CTPC3TWV3BCTM5HWU2GJJRGN67AV1FSS5C88A';
    const secretKey = '0463ac5595ff97473972ea9472fff69eb08ca0a2';
    const account = '3f4abaf6-52ac-40c6-b155-d04caeb0391f';

    const address: CheckoutAddress = {
      line1: '1 Fake Street',
      city: 'Fake City',
      state: 'AL',
      zip: '21000',
      country: 'US'
    };

    const checkoutBody: CheckoutBody = {
      campaign: campaignId,
      customer: {
        firstname: user.firstName || 'Fixed',
        lastname: user.lastName || 'Fixed',
        email: user.id || 'fixed@sixcrm.com',
        address: address
      },
      creditcard: {
        name: creditCard.name,
        number: creditCard.ccnumber,
        expiration: creditCard.expiration,
        ccv: creditCard.ccv
      },
      product_schedules: [{quantity: 1, product_schedule: planId}]
    };

    let response: Subject<CheckoutResponse | TransactionalResponseError> = new Subject();

    this.acquireToken(campaignId, account, secretKey, accessKey).subscribe(acquireTokenResponse => {

      this.performCheckout(checkoutBody, acquireTokenResponse.body.response, account).subscribe(checkoutResponse => {
        response.next(new CheckoutResponse(checkoutResponse.body.response).withSuccess(checkoutResponse.body.response.result === "success"));
      }, error => response.next(new TransactionalResponseError(error.status, error.body ? error.body.message: error.message)))

    }, error => response.next(new TransactionalResponseError(error.status, error.body ? error.body.message: error.message)));

    return response;
  }

  private acquireToken(campaignId: string, account: string, secretKey: string, accessKey: string) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.createSignature(secretKey, accessKey));

    const body = {campaign: campaignId};
    const endpoint = environment.bareEndpoint + 'token/acquire/' + account;

    return this.http.post<any>(endpoint, body, {observe: 'response', responseType: 'json', headers: headers})
  }

  private performCheckout(checkoutBody: CheckoutBody, token: string, account?: string) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', token);

    const body = checkoutBody;
    const endpoint = environment.bareEndpoint + 'checkout/' + (account || this.authService.getActiveAcl().account.id);

    return this.http.post<any>(endpoint, body, {observe: 'response', responseType: 'json', headers: headers})
  }

  private createSignature(secretKey: string, accessKey: string) {
    let requestTime = utc().unix() * 1000;
    let signature = sha1(secretKey+requestTime);

    return accessKey+':'+requestTime+':'+signature;
  }
}
