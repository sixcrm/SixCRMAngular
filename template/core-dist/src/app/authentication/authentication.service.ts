import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { BehaviorSubject} from "rxjs";
import {environment} from '../../environments/environment';

declare var Auth0Lock: any;

interface AuthResult {
  accessToken: string;
  idToken: string;
}

@Injectable()
export class AuthenticationService {

  private lock: any;
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';

  public profileData$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private router: Router) {
    this.lock = new Auth0Lock(
      environment.clientID,
      environment.domain,
      {
        theme: { logo: '/assets/favicons/favicon-icon.png'},
        languageDictionary: {
          title: 'SixCRM'
        }
      });

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

  public getToken() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTNiMDg2YjgtNjM0My00MjcxLTg3ZDYtYjJhMDAxNDlmMDcwIiwiaWF0IjoxNDg2MDI3Mzc2fQ.WWso40RRK-xHIvMOm2NEFGEnQHkJH2KQq_FWShkQ0GM';
  }

  private setUser(authResult: AuthResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);

    this.getProfileData();
  }
}
