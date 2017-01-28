import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BaseService} from '../shared/services/base.service';
import { tokenNotExpired } from 'angular2-jwt';
import { myConfig } from './auth.config';

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationService extends BaseService {
  lock = new Auth0Lock(myConfig.clientID, myConfig.domain, {});

  constructor(protected _http: Http) {
    super(_http);
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken)
    });
  }

  public login() {
    this.lock.show();
  };

  public authenticated(){
    return tokenNotExpired();
  }

  public logout(){
    localStorage.removeItem('id_token');
  }
}
