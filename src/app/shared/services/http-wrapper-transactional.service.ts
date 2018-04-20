import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {utc} from 'moment';
import {CheckoutBody} from '../models/checkout-body.model';

var sha1 = require('sha1');

@Injectable()
export class HttpWrapperTransactionalService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  acquireToken(campaignId: string) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.createSignature());

    const body = {campaign: campaignId};
    const endpoint = environment.bareEndpoint + 'token/acquire/' + this.authService.getActiveAcl().account.id;

    return this.http.post(endpoint, body, {observe: 'response', responseType: 'json', headers: headers})
  }

  checkout(checkoutBody: CheckoutBody) {
    this.acquireToken(checkoutBody.campaign).subscribe(response => {
      console.log(response)
    })
  }

  private createSignature() {
    let requestTime = utc().unix() * 1000;
    let secretKey = '5d2ecbdfec89388c432bf4d8562aa8f6e0f513c9';
    let accessKey = 'XKCEKXSQY9LU9SQECFY3STM1LVLVTGW3EXH9ZH7X';
    let signature = sha1(secretKey+accessKey);

    return accessKey+':'+requestTime+':'+signature;
  }
}
