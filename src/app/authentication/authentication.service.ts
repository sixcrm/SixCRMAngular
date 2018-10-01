import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {User} from '../shared/models/user.model';
import {Acl} from '../shared/models/acl.model';
import {
  userIntrospection, registerUser, acknowledgeInviteQuery,
  acceptInviteMutation
} from '../shared/utils/queries/entities/user.queries';
import {
  extractData, HttpWrapperService, generateHeaders, FailStrategy,
  RetryStrategy
} from '../shared/services/http-wrapper.service';
import {HttpResponse} from '@angular/common/http';
import {Account} from '../shared/models/account.model';
import {YesNoDialogComponent} from '../dialog-modals/yes-no-dialog.component';
import {UserSettings} from '../shared/models/user-settings';
import {updateAccountForRegistrationMutation} from '../shared/utils/queries/entities/account.queries';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AcknowledgeInvite} from '../shared/models/acknowledge-invite.model';
import {CustomServerError} from '../shared/models/errors/custom-server-error';
import {utc} from 'moment';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthenticationService {

  private auth;

  private redirectUrl: string = 'redirect_url';
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';
  private activated: string = 'activated';
  private idTokenPayload: string = 'id_token_payload';
  private sixUser: string = 'six_user';
  private activeAcl: string = 'active_acl';
  private isInvitedUserKey: string = 'is_invited_user';

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

  private yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private router: Router,
    private http: HttpWrapperService,
    private location: Location,
    private dialog: MatDialog
  ) {
    this.initLock();

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

  private initLock() {
    const options = {
      clientID: environment.clientID,
      domain: environment.domain,
      responseType: 'token',
      redirectUri: environment.auth0RedirectUrl,
      scope: 'openid email name given_name family_name user_metadata app_metadata picture'
    };

    this.auth = new auth0.WebAuth(options);

    this.auth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        let sub = this.activeAcl$.subscribe(acl => {
          if (acl && acl.id) {
            this.newSessionStarted$.next(true);
            sub.unsubscribe();
          }
        });

        this.setUser(authResult);
      } else if (err) {
        this.logout()
      }
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
    const token = this.getToken();

    if (!token) return false;

    return !this.jwtHelper.isTokenExpired(token);
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

  public isInvitedUser(): boolean {
    const isInvited = !!localStorage.getItem(this.isInvitedUserKey);

    if (isInvited) {
      localStorage.removeItem(this.isInvitedUserKey);
    }

    return isInvited;
  }

  public showLogin(): void {
    this.initLock();
    this.auth.authorize({login_hint: this.router.url === '/signup' ? 'signUp' : '', env: environment.name});
  }

  public logout(redirectUrl?: string): void {
    if (redirectUrl) {
      localStorage.setItem(this.redirectUrl, redirectUrl);
    } else {
      localStorage.removeItem(this.redirectUrl);
    }

    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idToken);
    localStorage.removeItem(this.activated);
    localStorage.removeItem(this.idTokenPayload);
    localStorage.removeItem(this.sixUser);

    this.auth.logout({returnTo: environment.auth0RedirectUrl});
  }

  public logoutToSignup(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idToken);
    localStorage.removeItem(this.activated);
    localStorage.removeItem(this.idTokenPayload);
    localStorage.removeItem(this.sixUser);

    this.auth.logout({returnTo: environment.auth0RedirectUrl + '/signup'});
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

  public getPayload(): any {
    let payload = localStorage.getItem(this.idTokenPayload);

    return JSON.parse(payload);
  }

  public getAcls(): Acl[] {
    return this.getSixUser().acls.filter(acl => !acl.pending);
  }

  public getActiveAcl(): Acl {
    if (!this.currentActiveAcl || !this.currentActiveAcl.account || !this.currentActiveAcl.account.id) {
      this.currentActiveAcl = new Acl(JSON.parse(localStorage.getItem(this.activeAcl)));
    }

    return this.currentActiveAcl;
  }

  public getActiveAccount(): Account {
    const actingAs = this.getActingAsAccount();

    if (!actingAs || !actingAs.id) {
      return this.getActiveAcl().account;
    }

    return actingAs;
  }

  public isActiveAclCustomerService(): boolean {
    return this.getActiveAcl().role.isCustomerService();
  }

  public isActiveAclMasterAccount(): boolean {
    return !this.getActingAsAccount() && this.getActiveAcl().account.id === '*';
  }

  public isActiveOrActingAclMasterAccount(): boolean {
    return this.getActiveAcl().account.id === '*';
  }

  public changeActiveAcl(acl: Acl, noRedirection?: boolean): void {
    if (this.getActingAsAccount()) {
      this.actingAsAccount$.next(null);
    }

    this.setActiveAcl(acl);

    if (noRedirection) return;

    this.redirectAfterAclChange(this.isActiveAclCustomerService() ? '/customer-service' : '/dashboard');
  }

  public isBillingDisabled(): boolean {
    const account = this.getActiveAcl().account;

    if (!account.billing || !account.billing.disable) return false;

    return utc().isAfter(utc(account.billing.disable))
  }

  public isBillingDisabledOrSoonToBeDisabled(): boolean {
    if (!this.getActiveAcl().account.billing) return false;

    const account = this.getActiveAcl().account;

    return utc(account.billing.disable).diff(utc(), 'd') <= 7;
  }

  public registerUser(company: string, firstName: string, lastName: string, terms?: string): Observable<HttpResponse<any> | CustomServerError> {
    const endpoint = `${environment.endpoint}*`;
    let user = this.getSixUser();
    user.name = `${firstName} ${lastName}`;
    user.company = company;
    user.firstName = firstName;
    user.lastName = lastName;
    user.active = true;
    user.termsAndConditions = terms || '0.1';

    return this.http.postWithError(endpoint, registerUser(user), {headers: generateHeaders(this.getToken())}, {failStrategy: FailStrategy.Soft, retry: { strategy: RetryStrategy.Retry }});
  }

  public acknowledgeInvite(hash: string): Observable<HttpResponse<any> | CustomServerError>{
    return this.http.postWithError(
      environment.publicendpoint,
      acknowledgeInviteQuery(hash),
      null,
      {failStrategy: FailStrategy.Soft, ignoreSnack: true, retry: { strategy: RetryStrategy.Retry }}
    );
  }

  public acceptInvite(hash: string, signature: string): Observable<{isNew: boolean, account: string}> {
    return this.http.post(
      environment.publicendpoint,
      acceptInviteMutation(hash, signature),
      null,
      { failStrategy: FailStrategy.HardStandalone, retry: { strategy: RetryStrategy.Retry }}
    ).map(data => {
      const d = data.body.response.data.acceptinvite;

      return {isNew: d.is_new, account: d.account};
    })
  }

  public updateCurrentAccount(company: string): Observable<HttpResponse<any> | CustomServerError> {
    let account = this.getActiveAcl().account;
    let endpoint = environment.endpoint + account.id;

    return this.http.postWithError(endpoint, updateAccountForRegistrationMutation(account, company), {headers: generateHeaders(this.getToken())}, {failStrategy: FailStrategy.Soft, ignoreSnack: true, retry: { strategy: RetryStrategy.Retry }});
  }

  public hasPermissions(entity: string, operation: string): boolean {
    if (this.actingAs && this.actingAs.id) return true;

    return this.getSixUser().hasPermissions(entity, operation, this.getActiveAcl());
  }

  public refreshAfterAcceptInvite(defaultAcl: Acl, isNewUser: boolean, acknowledgedInvite: AcknowledgeInvite): void {
    if (defaultAcl && defaultAcl.id) {
      localStorage.setItem(this.activeAcl, JSON.stringify(defaultAcl));
      this.currentActiveAcl = defaultAcl;
    }

    localStorage.setItem(this.isInvitedUserKey, 'true');

    if (!this.authenticated()) {
      this.educatedLogout(isNewUser);

      return;
    }

    if (this.getSixUser().email !== acknowledgedInvite.email) {
      this.educatedLogout(isNewUser);

      return;
    }

    this.updateUserData(JSON.parse(localStorage.getItem(this.idTokenPayload)));
  }

  private educatedLogout(isNewUser: boolean) {
    if (isNewUser) {
      this.logoutToSignup();
    } else {
      this.logout();
    }
  }

  public setShowWelcome(show: boolean): void {
    localStorage.setItem(this.currentSixUser.email + ':welcome', String(show));
  }

  public shouldShowWelcome(): boolean {
    let show = localStorage.getItem(this.currentSixUser.email + ':welcome');

    return show === null || show === 'true';
  }

  public setActiveDashboard(dashboard): void {
    localStorage.setItem(this.currentSixUser.email + ':' + this.getActiveAcl().account.id + ':dashboard', dashboard);
  }

  public getActiveDashboard(): any {
    let dashboard = localStorage.getItem(this.currentSixUser.email + ':' + this.getActiveAcl().account.id + ':dashboard');

    return dashboard || 0;
  }

  private setUser(authResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);
    localStorage.setItem(this.idTokenPayload, JSON.stringify(authResult.idTokenPayload));

    this.updateUserData(authResult.idTokenPayload);
  }

  private updateUserData(profile: any): void {
    if (!profile) {
      this.logout();
      return;
    }

    const redirectUrl = localStorage.getItem(this.redirectUrl);
    localStorage.removeItem(this.redirectUrl);

    this.getUserIntrospection(profile, redirectUrl);
  }

  getUserIntrospection(profile: any, redirectUrl?: string, forceRedirect?: boolean): void {
    this.http.postWithError(environment.endpoint + '*', userIntrospection(), { headers: generateHeaders(this.getToken())}, { retry: { strategy: RetryStrategy.Retry }, failStrategy: FailStrategy.Soft }).subscribe(
      (data) => {
        if (data instanceof CustomServerError) {
          this.logout();
          this.showLogin();
          return;
        }

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
          introspectionUser.acls = introspectionUser.acls.filter(acl => !acl.pending);
          if (profile) {
            introspectionUser.picture = profile.picture;
          }
          this.updateSixUser(introspectionUser);
          this.updateActiveAcl(introspectionUser);

          if (user && user.usersetting) {
            this.updateTimezone(user.usersetting.timezone);
          }

          this.updateSettings(new UserSettings(user.usersetting));

          if (redirectUrl && forceRedirect) {
            this.router.navigateByUrl(redirectUrl, {replaceUrl: true});
            return;
          }

          this.redirectAfterAclChange(redirectUrl, true);
        } else {
          this.logout();
        }
      }
    );
  }

  private redirectAfterAclChange(redirectUrl?: string, replaceUrlState?: boolean) {
    if (this.shouldRedirectToRegister()) {
      this.router.navigateByUrl('/register', {replaceUrl: !!replaceUrlState});
      return;
    }

    if (this.shouldRedirectToAccountInfo()) {
      this.router.navigateByUrl('/account-info', {replaceUrl: !!replaceUrlState});
      return;
    }

    if (this.shouldRedirectToBillingDisabled()) {
      this.router.navigate(['/billing-disabled'], {replaceUrl: !!replaceUrlState});
      return;
    }

    if (redirectUrl) {
      this.router.navigateByUrl(redirectUrl, {replaceUrl: !!replaceUrlState});
      return;
    }

    if (this.shouldRedirectToDashboard()) {
      this.router.navigateByUrl(this.isActiveAclCustomerService() ? '/customer-service' : '/dashboard', {replaceUrl: !!replaceUrlState});
    }
  }

  private shouldRedirectToAccountInfo() {
    return !this.getActiveAcl().account.billing
      || this.getSixUser().acls.length === 0
      || !this.getActiveAcl().account.active
      || this.getActiveAcl().role.isDisabled()
      || this.getActiveAcl().role.isNoPermissions();
  }

  private shouldRedirectToBillingDisabled() {
    return this.isBillingDisabled();
  }

  private shouldRedirectToRegister() {
    return !this.active()
      || (this.getActiveAcl().account.isNew() && (this.getActiveAcl().role.isOwner() || this.getActiveAcl().role.isAdmin()));
  }

  private shouldRedirectToDashboard(): boolean {
    return this.router.url === '/' || this.isCurrentUrlAuth0Redirect();
  }

  private isCurrentUrlAuth0Redirect(): boolean {
    return this.router.url.indexOf('/#access_token=') === 0;
  }

  private getUserIntrospectionExternal(redirect: string): void {
    this.http.post(environment.endpoint + '*', userIntrospection(), { headers: generateHeaders(this.getToken())}, { retry: { strategy: RetryStrategy.Retry } }).subscribe(
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

  public refreshActiveAcl(aclId?: string): void {
    if (!aclId) {
      localStorage.removeItem(this.activeAcl);
    }
    this.updateActiveAcl(this.currentSixUser, aclId);
  }

  private updateActiveAcl(user: User, aclId?: string): void {
    let currentAclId;
    if (!aclId) {
      currentAclId = new Acl(JSON.parse(localStorage.getItem(this.activeAcl))).id;
    } else {
      currentAclId = aclId;
    }
    const currentAcl = user.getAclWithId(currentAclId);
    if (currentAcl) {
      this.setActiveAcl(currentAcl);
    } else {
      let defaultAcl: Acl = user.acls.filter((acl) => !acl.pending && acl.account.name === 'Master Account')[0] || user.acls.filter(acl => !acl.pending)[0];

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
