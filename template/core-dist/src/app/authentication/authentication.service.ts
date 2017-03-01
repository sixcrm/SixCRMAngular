import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {environment} from '../../environments/environment';
import {Http, Headers, Response} from '@angular/http';
import {
  userQueryByEmail, createUserForRegistration, updateUserForRegistration,
  createCreditCardMutation
} from '../shared/utils/query-builder';
import {User} from '../shared/models/user';
import {CreditCard} from '../shared/models/credit-card.model';
let Sha1 = require('../../../node_modules/sha.js/sha1.js');

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationService {

  private lock: any;
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';
  private activated: string = 'activated';
  private idTokenPayload: string = 'id_token_payload';
  private sixUser: string = 'six_user';

  public userData$: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  public userUnderReg$: BehaviorSubject<any> = new BehaviorSubject<User>(null);

  constructor(private router: Router, private http: Http) {
    this.lock = new Auth0Lock(
      environment.clientID,
      environment.domain,
      {
        auth: {
          redirectUrl: environment.auth0RedirectUrl,
          responseType: 'token',
          params: {
            scope: 'openid email user_metadata app_metadata picture'
          }
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
      this.getUserByEmail(JSON.parse(localStorage.getItem(this.idTokenPayload)));
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
    localStorage.removeItem(this.idTokenPayload);
    localStorage.removeItem(this.sixUser);
  }

  public getToken(): string {
    // return 'deathstalker';
    return localStorage.getItem(this.idToken);
  }

  public getSixUserAccountId(): string {
    let sixUser = localStorage.getItem(this.sixUser);

    return sixUser ? (JSON.parse(sixUser)).id : '';
  }

  private setUser(authResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);
    localStorage.setItem(this.idTokenPayload, JSON.stringify(authResult.idTokenPayload));

    this.getUserByEmail(authResult.idTokenPayload);
  }

  private getUserByEmail(profile: any): void {
    this.http.post(environment.endpoint, userQueryByEmail(profile.email), { headers: this.generateHeaders()}).subscribe(
      (data) => {
        let user = data.json().data.user;
        if (!user) {
          this.createUserForRegistration(profile.email);
        } else {
          if (user.active !== 'true') {
            localStorage.removeItem(this.activated);
            this.router.navigateByUrl('/register');
            this.userUnderReg$.next(new User(user));
          } else {
            let activatedUser: User = new User(user);
            activatedUser.picture = profile.picture;
            this.userData$.next(activatedUser);

            localStorage.setItem(this.sixUser, JSON.stringify(activatedUser.inverse()));
            localStorage.setItem(this.activated, 'activated');
            if (this.router.url === '/') {
              this.router.navigateByUrl('/dashboard');
            }
          }
        }
      }
    );
  }

  private createUserForRegistration(email: string): void {
    this.http.post(environment.endpoint, createUserForRegistration(email, localStorage.getItem(this.idToken)), { headers: this.generateHeaders()})
      .subscribe(
        (data) => {
          localStorage.removeItem(this.activated);
          this.router.navigateByUrl('/register');
          this.userUnderReg$.next(new User(data.json().data.createuser));
        });
  }

  public updateUserForRegistration(user: User, cc: CreditCard): Observable<boolean> {
    let subject: Subject<boolean> = new Subject<boolean>();

    this.http.post(environment.endpoint, createCreditCardMutation(cc), { headers: this.generateHeaders()})
      .subscribe(
        () => {
          this.http.post(environment.endpoint, updateUserForRegistration(user), { headers: this.generateHeaders()})
            .subscribe(
              (data) => {
                this.userUnderReg$.next(new User(data.json().data.updateuser));
                subject.next(true);
              },
              () => {
                subject.next(false);
              }
            );
        },
        () => {
          subject.next(false);
        }
      );

    return subject;
  }

  private generateAcquireJWTHeaders(authString: string): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authString);

    return headers;
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getToken());

    return headers;
  }
}
