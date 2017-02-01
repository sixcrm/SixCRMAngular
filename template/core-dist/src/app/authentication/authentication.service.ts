import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { myConfigN } from './auth.config';
import {Subject, BehaviorSubject} from "rxjs";

declare var Auth0Lock: any;

interface AuthResult {
  accessToken: string;
  idToken: string;
}

@Injectable()
export class AuthenticationService {

  private lock = new Auth0Lock(myConfigN.clientID, myConfigN.domain, {});
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';

  public profileData$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private router: Router) {
    this.lock.on('authenticated', (authResult: AuthResult) => {
      this.setUser(authResult);
      this.router.navigate(['/dashboard']);
    });

    if (this.authenticated()) {
      this.getProfileData();
    }
  }

  public authenticated(): boolean {
    return tokenNotExpired();
  }

  public login(): void {
    this.lock.show();
  }

  public logout(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idToken);

    this.router.navigate(['/auth']);
  }

  public getProfileData(): void {
    this.lock.getUserInfo(localStorage.getItem(this.accessToken), (error, profile) => {
      this.profileData$.next(profile);
    })
  }

  private setUser(authResult: AuthResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);

    this.getProfileData();
  }
}
