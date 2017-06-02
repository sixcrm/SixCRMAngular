import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {environment} from '../../environments/environment';
import {Http, Headers} from '@angular/http';
import {
  userIntrospection,
  updateUserForRegistration,
  createCreditCardMutation,
  acceptInviteMutation,
  updateUserForActivation
} from '../shared/utils/query-builder';
import {User} from '../shared/models/user.model';
import {CreditCard} from '../shared/models/credit-card.model';
import {Acl} from '../shared/models/acl.model';
import {UserSettings} from '../shared/models/user-settings';

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationService {

  private lock: any;
  private redirectUrl: string = 'redirect_url';
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';
  private activated: string = 'activated';
  private idTokenPayload: string = 'id_token_payload';
  private sixUser: string = 'six_user';
  private activeAcl: string = 'active_acl';

  private currentSixUser: User = new User();
  private currentActiveAcl: Acl = new Acl();

  public sixUser$: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  private user: User;
  private timezone: string = 'America/Los_Angeles';
  public userUnderReg$: BehaviorSubject<any> = new BehaviorSubject<User>(null);
  public activeAcl$: BehaviorSubject<Acl> = new BehaviorSubject<Acl>(new Acl());
  public activeAclChanged$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router, private http: Http, private location: Location) {
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

    // wait for router to load route so that we can check if we should trigger user introspection
    setTimeout(() => {
      if (this.authenticated() && !this.router.url.includes('acceptinvite')) {
        this.getUserIntrospection(JSON.parse(localStorage.getItem(this.idTokenPayload)));
      }
    }, 1);

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

  public logout(redirectUrl?: string): void {
    if (redirectUrl) {
      localStorage.setItem(this.redirectUrl, redirectUrl);
    }

    this.router.navigate(['/']);

    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idToken);
    localStorage.removeItem(this.activated);
    localStorage.removeItem(this.idTokenPayload);
    localStorage.removeItem(this.sixUser);
  }

  public logoutWithJwt(jwt: string, url: string): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idTokenPayload);
    localStorage.removeItem(this.sixUser);
    localStorage.removeItem(this.activated);
    localStorage.setItem(this.idToken, jwt);

    this.getUserIntrospectionExternal(url);
  }

  public getToken(): string {
    return localStorage.getItem(this.idToken);
  }

  public getSixUser(): User {
    if (!this.currentSixUser || !this.currentSixUser.id) {
      this.currentSixUser = new User(localStorage.getItem(this.sixUser));
    }

    return this.currentSixUser;
  }

  public getTimezone(): string {
    return this.timezone || 'America/Los_Angeles';
  }

  public updateTimezone(timezone: string): void {
    this.timezone = timezone || this.timezone || 'America/Los_Angeles';
  }

  public getUserEmail(): string {
    let payload = this.getPayload();

    if (!payload) {
      return '';
    }

    return payload.email;
  }

  public getUserPicture(): string {
    let payload = this.getPayload();

    if (!payload) {
      return '';
    }

    return payload.picture;
  }

  public getPayload(): any {
    let payload = localStorage.getItem(this.idTokenPayload);

    return JSON.parse(payload);
  }

  public getAcls(): Acl[] {
    return this.getSixUser().acls;
  }

  public getActiveAcl(): Acl {
    if (!this.currentActiveAcl || !this.currentActiveAcl.account || !this.currentActiveAcl.account.id) {
      this.currentActiveAcl = new Acl(JSON.parse(localStorage.getItem(this.activeAcl)));
    }

    return this.currentActiveAcl;
  }

  public isActiveAclCustomerService(): boolean {
    return this.getActiveAcl().role.name === 'Customer Service';
  }

  public changeActiveAcl(acl: Acl): void {
    localStorage.setItem(this.activeAcl, JSON.stringify(acl.inverse()));
    this.currentActiveAcl = acl;
    this.activeAcl$.next(acl);
    this.activeAclChanged$.next(true);
  }

  public updateUserForRegistration(user: User, cc: CreditCard): Observable<boolean> {
    let subject: Subject<boolean> = new Subject<boolean>();

    if (!this.user.acls || !this.user.acls[0]) {
      this.logout();
    } else {
      let endpoint = environment.endpoint + this.user.acls[0].account.id;
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

    let endpoint = environment.endpoint + this.getActiveAcl().account.id;
    this.http.post(endpoint, updateUserForActivation(user), { headers: this.generateHeaders() })
      .subscribe(
        () => {
          subject.next(true);
        },
        () => {
          subject.next(false);
        }
      );

    return subject;
  }

  public activateUser(token: string, param: string): Observable<User> {
    let subject = new Subject<User>();

    this.http.post(environment.endpoint + '*', acceptInviteMutation(token, param), { headers: this.generateHeaders() }).subscribe(
      (data) => {
        let userData = data.json().data.acceptinvite;
        let user: User = new User(userData);
        user.picture = this.getUserPicture();

        this.updateSixUser(user);

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

  public refreshSixUser(redirectUrl?: string): void {
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    } else {
      this.router.navigateByUrl('/');
    }

    localStorage.removeItem(this.activeAcl);
    this.currentActiveAcl = new Acl();
    this.getUserData(JSON.parse(localStorage.getItem(this.idTokenPayload)));
  }

  private setUser(authResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);
    localStorage.setItem(this.idTokenPayload, JSON.stringify(authResult.idTokenPayload));

    this.getUserData(authResult.idTokenPayload);
  }

  private getUserData(profile: any): void {
    if (!profile) {
      this.logout();
      return;
    }

    let redirectUrl = localStorage.getItem(this.redirectUrl);
    localStorage.removeItem(this.redirectUrl);

    if (redirectUrl) {
      setTimeout(() => {
        this.router.navigateByUrl(redirectUrl);
      }, 300);
    } else {
      this.getUserIntrospection(profile);
    }
  }

  private getUserIntrospection(profile: any): void {
    this.http.post(environment.endpoint + '*', userIntrospection(), { headers: this.generateHeaders()}).subscribe(
      (data) => {
        let user = data.json().data.userintrospection;
        if (user) {
          if (user.active !== 'true') {
            localStorage.removeItem(this.activated);

            if (!this.router.url.includes('acceptinvite')) {
              this.router.navigateByUrl('/register');
            }

            this.user = new User(user);
            this.user.auth0Id = this.getToken();
            this.userUnderReg$.next(this.user);
          } else {
            localStorage.setItem(this.activated, 'activated');

            let activatedUser: User = new User(user);

            if (profile) {
              activatedUser.picture = profile.picture;
            }

            this.updateSixUser(activatedUser);
            this.getOrUpdateActiveAcl(activatedUser);

            if (user && user.usersetting) {
              this.updateTimezone(user.usersetting.timezone);
            }

            if (this.router.url === '/') {
              let redirect = '/dashboard';
              if (this.isActiveAclCustomerService()) {
                redirect = '/search';
              }

              this.router.navigateByUrl(redirect);
            }
          }
        } else {
          this.logout();
        }
      }
    );
  }

  private getUserIntrospectionExternal(redirect: string): void {
    this.http.post(environment.endpoint + '*', userIntrospection(), { headers: this.generateHeaders()}).subscribe(
      (data) => {
        let user = data.json().data.userintrospection;
        if (user) {
          localStorage.setItem(this.activated, 'activated');

          let activatedUser: User = new User(user);

          this.updateSixUser(activatedUser);

          this.getOrUpdateActiveAcl(activatedUser);

          this.location.replaceState(redirect);
          this.router.navigateByUrl(redirect);
        } else {
          this.logout();
        }
      }
    );
  }

  public updateSixUser(user: User): void {
    if (!user.picture) {
      user.picture = this.currentSixUser.picture;
    }

    localStorage.setItem(this.sixUser, JSON.stringify(user.inverse()));
    this.currentSixUser = user;
    this.sixUser$.next(user);
  }

  private getOrUpdateActiveAcl(user: User): void {
    let currentAcl = new Acl(JSON.parse(localStorage.getItem(this.activeAcl)));

    if (this.containsAcl(user.acls, currentAcl)) {
      this.activeAcl$.next(currentAcl);
    } else {
      let defaultAcl: Acl = user.acls.filter((acl) => acl.account.name === 'Master Account')[0] || user.acls[0];

      if (defaultAcl) {
        localStorage.setItem(this.activeAcl, JSON.stringify(defaultAcl.inverse()));
        this.currentActiveAcl = defaultAcl;
        this.activeAcl$.next(defaultAcl);
        this.activeAclChanged$.next(true);
      }
    }
  }

  private containsAcl(acls: Acl[], acl: Acl): boolean {
    if (!acls || acls.length === 0 || !acl.account.id) {
      return false;
    }

    return acls.filter((element) => element.account.id === acl.account.id).length !== 0;
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getToken());

    return headers;
  }
}
