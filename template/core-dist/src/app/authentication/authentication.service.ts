import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { BehaviorSubject} from "rxjs";
import {environment} from '../../environments/environment';
import {Http, Headers} from '@angular/http';
import {userQueryByEmail, createUserByEmailAndA0} from '../shared/utils/query-builder';

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationService {

  private lock: any;
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';
  private activated: string = 'activated';

  public profileData$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private router: Router, private http: Http) {
    this.lock = new Auth0Lock(
      environment.clientID,
      environment.domain,
      {
        auth: {
          redirectUrl: environment.auth0RedirectUrl,
          responseType: 'token'
        },
        theme: {
          logo: '/assets/favicons/favicon-icon.png'
        },
        languageDictionary: {
          title: 'SixCRM'
        }
      });

    this.lock.on('authenticated', (authResult) => {
      this.setUser(authResult);
    });

    if (this.authenticated()) {
      this.getProfileData(true);
    }
  }

  public authenticated(): boolean {
    return tokenNotExpired();
  }

  public authenticatedAndActivated(): boolean {
    return this.authenticated() && !!localStorage.getItem(this.activated);
  }

  public showLogin(): void {
    this.lock.show();
  }

  public logout(): void {
    this.router.navigate(['/']);

    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idToken);
    localStorage.removeItem(this.activated);
  }

  public getProfileData(full?: boolean): void {
    this.lock.getUserInfo(localStorage.getItem(this.accessToken), (error, profile) => {
      this.profileData$.next(profile);

      if (full) {
        this.getUserByEmail(profile.email);
      }
    })
  }

  public getToken(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTNiMDg2YjgtNjM0My00MjcxLTg3ZDYtYjJhMDAxNDlmMDcwIiwiaWF0IjoxNDg2MDI3Mzc2fQ.WWso40RRK-xHIvMOm2NEFGEnQHkJH2KQq_FWShkQ0GM';
  }

  private setUser(authResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);

    this.getProfileData(true);
  }

  private getUserByEmail(email: string): void {
    this.http.post(environment.endpoint, userQueryByEmail(email), { headers: this.generateHeaders()}).subscribe(
      (data) => {
        let user = data.json().data.user;
        if (!user) {
          this.createUser(email);
        } else if (!user.active || user.active !== 'true') {
          localStorage.removeItem(this.activated);
          this.router.navigateByUrl('/register');
        } else {
          localStorage.setItem(this.activated, 'activated');
          this.router.navigateByUrl('/dashboard');
        }
      }
    );
  }

  private createUser(email: string): void {
    this.http.post(environment.endpoint, createUserByEmailAndA0(email, localStorage.getItem(this.idToken)), { headers: this.generateHeaders()})
      .subscribe(
        () => {
          localStorage.removeItem(this.activated);
          this.router.navigateByUrl('/register');
        });
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getToken());

    return headers;
  }
}
