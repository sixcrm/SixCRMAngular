import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {User} from '../shared/models/user.model';
import {Acl} from '../shared/models/acl.model';
import {
  updateUserForActivation,
  userIntrospection, acceptInviteMutation, registerUser
} from '../shared/utils/queries/entities/user.queries';
import {extractData, HttpWrapperService, generateHeaders, FailStrategy} from '../shared/services/http-wrapper.service';
import {Response} from '@angular/http';
import {updateAccountMutation} from '../shared/utils/query-builder';
import {Account} from '../shared/models/account.model';
import {YesNoDialogComponent} from '../pages/yes-no-dialog.component';
import {MdDialogRef, MdDialog} from '@angular/material';
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
  private currentUserSettings: UserSettings = new UserSettings();
  private currentActiveAcl: Acl = new Acl();
  private actingAs: Account;

  private timezone: string = 'America/Los_Angeles';
  public sixUser$: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  public userSettings$: BehaviorSubject<UserSettings> = new BehaviorSubject(null);
  public sixUserActivated$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public activeAcl$: BehaviorSubject<Acl> = new BehaviorSubject<Acl>(new Acl());
  public actingAsAccount$: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);
  public newSessionStarted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private yesNoDialogRef: MdDialogRef<YesNoDialogComponent>;

  constructor(
    private router: Router,
    private http: HttpWrapperService,
    private location: Location,
    private dialog: MdDialog,
  ) {
    this.lock = new Auth0Lock(
      environment.clientID,
      environment.domain,
      {
        auth: {
          redirectUrl: environment.auth0RedirectUrl,
          responseType: 'token',
          params: {
            scope: 'openid email name given_name family_name user_metadata app_metadata picture'
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
      let sub = this.activeAcl$.subscribe(acl => {
        if (acl && acl.id) {
          this.newSessionStarted$.next(true);
          sub.unsubscribe();
        }
      });

      this.setUser(authResult);
    });

    // wait for router to load route so that we can check if we should trigger user introspection
    setTimeout(() => {
      if (this.authenticated() && !this.router.url.includes('acceptinvite')) {
        this.getUserIntrospection(JSON.parse(localStorage.getItem(this.idTokenPayload)));
      }
    }, 1);

    this.actingAsAccount$.subscribe(account => {
      this.actingAs = account;
    });

  }

  public startActingAs(account: Account) {
    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, { disableClose : true });
    this.yesNoDialogRef.componentInstance.text = `By using this feature, all of your actions will affect the account '${account.name}'. Do you wish to proceed?`;

    this.yesNoDialogRef.afterClosed().take(1).subscribe(result => {
      this.yesNoDialogRef = null;

      if (result.success) {
        this.actingAsAccount$.next(account);
      }
    });
  }

  public stopActingAs() {
    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, { disableClose : true });
    this.yesNoDialogRef.componentInstance.text = 'Stop acting as this Account?';

    this.yesNoDialogRef.afterClosed().take(1).subscribe(result => {
      this.yesNoDialogRef = null;

      if (result.success) {
        this.actingAsAccount$.next(null);
        this.router.navigate(['/accounts']);
      }
    });
  }

  getActingAsAccount(): Account {
    return this.actingAs;
  }

  public authenticated(): boolean {
    return tokenNotExpired();
  }

  public active(): boolean {
    return !!localStorage.getItem(this.activated);
  }

  public setActive(value: boolean): void {
    if (value) {
      localStorage.setItem(this.activated, 'activated');
      this.sixUserActivated$.next(true);
    } else {
      localStorage.removeItem(this.activated);
    }
  }

  public authenticatedAndActivated(): boolean {
    return this.authenticated() && this.active();
  }

  public showLogin(): void {
    this.lock.show();
  }

  public logout(redirectUrl?: string): void {
    if (redirectUrl) {
      localStorage.setItem(this.redirectUrl, redirectUrl);
    } else {
      localStorage.removeItem(this.redirectUrl);
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

  public updateSettings(settings: UserSettings): void {
    this.currentUserSettings = settings.copy();

    this.userSettings$.next(this.currentUserSettings);
  }

  public getUserSettings(): UserSettings {
    return this.currentUserSettings;
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

  public isActiveAclMasterAccount(): boolean {
    return !this.getActingAsAccount() && this.getActiveAcl().account.id === '*';
  }

  public isActiveOrActingAclMasterAccount(): boolean {
    return this.getActiveAcl().account.id === '*';
  }

  public changeActiveAcl(acl: Acl): void {
    if (this.getActingAsAccount()) {
      this.actingAsAccount$.next(null);
    }

    this.setActiveAcl(acl);

    if (acl.role.name === 'Customer Service') {
      this.router.navigateByUrl('/customer-service-dashboard');
    } else if (acl.role.name === 'Owner' && acl.termsAndConditionsOutdated) {
      this.router.navigateByUrl('/terms-and-conditions');
    } else {
      this.router.navigateByUrl('/dashboard');
    }

  }

  public registerUser(company: string, firstName: string, lastName: string): Observable<Response> {
    let endpoint = environment.endpoint + this.getSixUser().acls[0].account.id;
    let user = this.getSixUser();
    user.name = `${firstName} ${lastName}`;
    user.company = company;
    user.firstName = firstName;
    user.lastName = lastName;
    user.active = true;

    return this.http.post(endpoint, registerUser(user), {headers: generateHeaders(this.getToken())});
  }

  public updateCurrentAccount(company: string): Observable<Response> {
    let account = this.getSixUser().acls[0].account;
    let endpoint = environment.endpoint + account.id;

    return this.http.post(endpoint, updateAccountMutation(account, company), {headers: generateHeaders(this.getToken())});
  }

  public updateUserForAcceptInvite(user: User): Observable<boolean> {
    let subject: Subject<boolean> = new Subject<boolean>();

    let endpoint = environment.endpoint + this.getActiveAcl().account.id;
    this.http.post(endpoint, updateUserForActivation(user), { headers: generateHeaders(this.getToken()) })
      .subscribe(
        () => {
          subject.next(true);
        }
      );

    return subject;
  }

  public activateUser(token: string, param: string): Observable<User> {
    let subject = new Subject<User>();

    this.http.post(
      environment.endpoint + '*', acceptInviteMutation(token, param),
      { headers: generateHeaders(this.getToken()) },
      { failStrategy: FailStrategy.HardStandalone }
    ).subscribe(
      (data) => {
        let userData = extractData(data).acceptinvite;
        let user: User = new User(userData);
        user.picture = this.getUserPicture();

        this.updateSixUser(user);
        this.updateActiveAcl(user);

        subject.next(new User(userData));
      }
    );

    return subject;
  }

  public hasPermissions(entity: string, operation: string): boolean {
    return this.getSixUser().hasPermissions(entity, operation, this.getActiveAcl());
  }

  public refreshSixUser(): void {
    this.router.navigateByUrl('/');

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

    if (redirectUrl && redirectUrl.indexOf('acceptinvite') !== -1) {
      setTimeout(() => {
        this.router.navigateByUrl(redirectUrl);
      }, 300);
    } else {
      this.getUserIntrospection(profile, redirectUrl);
    }
  }

  private getUserIntrospection(profile: any, redirectUrl?: string): void {
    this.http.post(environment.endpoint + '*', userIntrospection(), { headers: generateHeaders(this.getToken())}).subscribe(
      (data) => {
        let user = extractData(data).userintrospection;
        if (user) {
          if (!user.active) {
            localStorage.removeItem(this.activated);
            this.sixUserActivated$.next(false);
          } else {
            localStorage.setItem(this.activated, 'activated');
            this.sixUserActivated$.next(true);
          }

          let introspectionUser: User = new User(user);
          if (profile) {
            introspectionUser.picture = profile.picture;
          }
          this.updateSixUser(introspectionUser);
          this.updateActiveAcl(introspectionUser);

          if (user && user.usersetting) {
            this.updateTimezone(user.usersetting.timezone);
          }

          this.updateSettings(new UserSettings(user.usersetting));

          this.redirectAfterIntrospection(redirectUrl);

        } else {
          this.logout();
        }
      }
    );
  }

  private redirectAfterIntrospection(redirectUrl?: string) {
    if (this.active() && redirectUrl) {
      this.router.navigateByUrl(redirectUrl);
      return;
    }

    if (this.shouldRedirectToTermsAndConditions()) {
      this.router.navigateByUrl('/terms-and-conditions');
      return;
    }

    if (this.shouldRedirectToDashboard()) {
      this.router.navigateByUrl(this.isActiveAclCustomerService() ? '/customer-service-dashboard' : '/dashboard');
    }
  }

  private shouldRedirectToTermsAndConditions(): boolean {
    return this.active() && (this.getSixUser().termsAndConditionsOutdated || this.getActiveAcl().termsAndConditionsOutdated)
  }

  private shouldRedirectToDashboard(): boolean {
    return this.router.url === '/' || (!this.active() && this.router.url.indexOf('/register') === -1)
  }

  private getUserIntrospectionExternal(redirect: string): void {
    this.http.post(environment.endpoint + '*', userIntrospection(), { headers: generateHeaders(this.getToken())}).subscribe(
      (data) => {
        let user = extractData(data).userintrospection;
        if (user) {
          let activatedUser: User = new User(user);
          this.updateSixUser(activatedUser);
          this.updateActiveAcl(activatedUser);

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

  public refreshActiveAcl(): void {
    localStorage.removeItem(this.activeAcl);
    this.updateActiveAcl(this.currentSixUser);
  }

  private updateActiveAcl(user: User): void {
    const currentAclId = new Acl(JSON.parse(localStorage.getItem(this.activeAcl))).id;
    const currentAcl = user.getAclWithId(currentAclId);

    if (currentAcl) {
      this.setActiveAcl(currentAcl);
    } else {
      let defaultAcl: Acl = user.acls.filter((acl) => acl.account.name === 'Master Account')[0] || user.acls[0];

      if (defaultAcl) {
        this.setActiveAcl(defaultAcl);
      }
    }
  }

  private setActiveAcl(acl: Acl): void {
    if (!acl) return;

    localStorage.setItem(this.activeAcl, JSON.stringify(acl.inverse()));
    this.currentActiveAcl = acl.copy();
    this.activeAcl$.next(acl.copy());
  }
}
