import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {environment} from '../../environments/environment';
import {Http, Headers} from '@angular/http';
import {
  userIntrospection, updateUserForRegistration,
  createCreditCardMutation, acceptInviteMutation
} from '../shared/utils/query-builder';
import {User} from '../shared/models/user.model';
import {CreditCard} from '../shared/models/credit-card.model';
import {Acl} from '../shared/models/acl.model';

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationService {

  private lock: any;
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';
  private activated: string = 'activated';
  private idTokenPayload: string = 'id_token_payload';
  private sixUser: string = 'six_user';
  private activeAcl: string = 'active_acl';

  public userData$: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  private userData: User;
  public userUnderReg$: BehaviorSubject<any> = new BehaviorSubject<User>(null);
  public activeAcl$: BehaviorSubject<Acl> = new BehaviorSubject<Acl>(new Acl());
  public activeAclChanged$: Subject<boolean> = new Subject<boolean>();

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
      this.getUserIntrospection(JSON.parse(localStorage.getItem(this.idTokenPayload)));
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
    localStorage.removeItem(this.activeAcl);
  }

  public getToken(): string {
    // return 'deathstalker';
    return localStorage.getItem(this.idToken);
  }

  public getSixUser(): User {
    let sixUser = localStorage.getItem(this.sixUser);

    return new User(JSON.parse(sixUser));
  }

  public getAcls(): Acl[] {
    return this.getSixUser().acls;
  }

  public getActiveAcl(): Acl {
    return new Acl(JSON.parse(localStorage.getItem(this.activeAcl)));
  }

  public changeActiveAcl(acl: Acl): void {
    localStorage.setItem(this.activeAcl, JSON.stringify(acl.inverse()));
    this.activeAcl$.next(acl);
    this.activeAclChanged$.next(true);
  }

  public updateUserForRegistration(user: User, cc: CreditCard): Observable<boolean> {
    let subject: Subject<boolean> = new Subject<boolean>();

    if (!this.userData.acls || !this.userData.acls[0]) {
      this.logout();
    } else {
      let endpoint = environment.endpoint + this.userData.acls[0].account.id;
      this.http.post(endpoint, createCreditCardMutation(cc), {headers: this.generateHeaders()})
        .subscribe(
          () => {
            this.http.post(endpoint, updateUserForRegistration(user), {headers: this.generateHeaders()})
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
    }

    return subject;
  }

  public updateUserForAcceptInvite(user: User): Observable<boolean> {
    let subject: Subject<boolean> = new Subject<boolean>();

    if (!this.userData.acls || !this.userData.acls[0]) {
      subject.next(false);
    } else {
      let endpoint = environment.endpoint + this.userData.acls[0].account.id;
      this.http.post(endpoint, updateUserForRegistration(user), { headers: this.generateHeaders() })
        .subscribe(
          () => {
            subject.next(true);
          },
          () => {
            subject.next(false);
          }
        );
    }

    return subject;
  }

  public activateUser(token: string, param: string): Observable<User> {
    let subject = new Subject<User>();

    this.http.post(environment.endpoint + '*', acceptInviteMutation(token, param), { headers: this.generateHeaders() }).subscribe(
      (data) => {
        let user = data.json().data.acceptinvite;
        subject.next(new User(user));
      },
      (error) => {
        console.log(error);
        subject.next(null);
      }
    );

    return subject;
  }

  public hasPermissions(entity: string, operation: string): boolean {
    return this.getSixUser().hasPermissions(entity, operation, this.getActiveAcl());
  }

  private setUser(authResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);
    localStorage.setItem(this.idTokenPayload, JSON.stringify(authResult.idTokenPayload));

    this.getUserIntrospection(authResult.idTokenPayload);
  }

  private getUserIntrospection(profile: any): void {
    if (!profile) {
      this.logout();
      return;
    }

    this.http.post(environment.endpoint + '*', userIntrospection(), { headers: this.generateHeaders()}).subscribe(
      (data) => {
        let user = data.json().data.userintrospection;
        if (user) {
          if (user.active !== 'true') {
            localStorage.removeItem(this.activated);
            this.router.navigateByUrl('/register');
            this.userData = new User(user);
            this.userData.auth0Id = this.getToken();
            this.userUnderReg$.next(this.userData);
          } else {
            localStorage.setItem(this.activated, 'activated');

            let activatedUser: User = new User(user);
            activatedUser.picture = profile.picture;

            this.updateSixUser(activatedUser);

            this.getOrUpdateActiveAcl(activatedUser);

            if (this.router.url === '/') {
              this.router.navigateByUrl('/dashboard');
            }
          }
        } else {
          this.logout();
        }
      }
    );
  }

  private updateSixUser(user: User): void {
    localStorage.setItem(this.sixUser, JSON.stringify(user.inverse()));
    this.userData$.next(user);
  }

  private getOrUpdateActiveAcl(user: User): void {
    let currentAcl: string = localStorage.getItem(this.activeAcl);

    if (currentAcl) {
      this.activeAcl$.next(new Acl(JSON.parse(currentAcl)));
    } else {
      let defaultAcl: Acl = user.acls[0];

      if (defaultAcl) {
        localStorage.setItem(this.activeAcl, JSON.stringify(defaultAcl.inverse()));
        this.activeAcl$.next(defaultAcl);
        this.activeAclChanged$.next(true);
      }
    }
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getToken());

    return headers;
  }
}
