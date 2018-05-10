import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {User} from '../shared/models/user.model';
import {Acl} from '../shared/models/acl.model';
import {
  userIntrospection, registerUser, acknowledgeInviteQuery,
  acceptInviteMutation
} from '../shared/utils/queries/entities/user.queries';
import {extractData, HttpWrapperService, generateHeaders, FailStrategy} from '../shared/services/http-wrapper.service';
import {HttpResponse} from '@angular/common/http';
import {Account} from '../shared/models/account.model';
import {YesNoDialogComponent} from '../pages/yes-no-dialog.component';
import {UserSettings} from '../shared/models/user-settings';
import {updateAccountForRegistrationMutation} from '../shared/utils/queries/entities/account.queries';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AcknowledgeInvite} from '../shared/models/acknowledge-invite.model';
import {CustomServerError} from '../shared/models/errors/custom-server-error';
import {utc} from 'moment';

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

  constructor(
    private router: Router,
    private http: HttpWrapperService,
    private location: Location,
    private dialog: MatDialog,
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

  private initLock(signup?: boolean) {
    const options = {
      auth: {
        redirectUrl: environment.auth0RedirectUrl,
        responseType: 'token',
        params: {
          scope: 'openid email name given_name family_name user_metadata app_metadata picture'
        }
      },
      closeable: false,
      theme: {
        logo: '/assets/images/' + (environment.branding ? environment.branding.registrationLogo : 'logo-navigation.svg')
      },
      languageDictionary: {
        title: ''
      },
      rememberLastLogin: false
    };

    if (signup) {
      options['initialScreen'] = 'signUp';
    }

    this.lock = new Auth0Lock(
      environment.clientID,
      environment.domain,
      options
    );

    this.lock.on('authenticated', (authResult) => {
      let sub = this.activeAcl$.subscribe(acl => {
        if (acl && acl.id) {
          this.newSessionStarted$.next(true);
          sub.unsubscribe();
        }
      });

      this.setUser(authResult);
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

  public isInvitedUser(): boolean {
    const isInvited = !!localStorage.getItem(this.isInvitedUserKey);

    if (isInvited) {
      localStorage.removeItem(this.isInvitedUserKey);
    }

    return isInvited;
  }

  public authenticatedAndActivated(): boolean {
    return this.authenticated() && this.active();
  }

  public showLogin(): void {
    this.initLock(this.router.url === '/signup');
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

  public logoutToSignup(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idToken);
    localStorage.removeItem(this.activated);
    localStorage.removeItem(this.idTokenPayload);
    localStorage.removeItem(this.sixUser);

    this.router.navigate(['/signup']);
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

  public registerUser(company: string, firstName: string, lastName: string, terms?: string): Observable<HttpResponse<any> | CustomServerError> {
    let endpoint = environment.endpoint + this.getActiveAcl().account.id;
    let user = this.getSixUser();
    user.name = `${firstName} ${lastName}`;
    user.company = company;
    user.firstName = firstName;
    user.lastName = lastName;
    user.active = true;
    user.termsAndConditions = terms || '0.1';

    return this.http.postWithError(endpoint, registerUser(user), {headers: generateHeaders(this.getToken())}, {failStrategy: FailStrategy.Soft});
  }

  public acknowledgeInvite(hash: string): Observable<AcknowledgeInvite> {
    return this.http.post(
      environment.publicendpoint,
      acknowledgeInviteQuery(hash),
      null,
      { failStrategy: FailStrategy.HardStandalone }
    ).map(data =>
      new AcknowledgeInvite(data.body.response.data.acknowledgeinvite)
    );
  }

  public acceptInvite(hash: string, signature: string): Observable<{isNew: boolean, account: string}> {
    return this.http.post(
      environment.publicendpoint,
      acceptInviteMutation(hash, signature),
      null,
      { failStrategy: FailStrategy.HardStandalone }
    ).map(data => {
      const d = data.body.response.data.acceptinvite;

      return {isNew: d.is_new, account: d.account};
    })
  }

  public updateCurrentAccount(company: string): Observable<HttpResponse<any> | CustomServerError> {
    let account = this.getActiveAcl().account;
    let endpoint = environment.endpoint + account.id;

    return this.http.postWithError(endpoint, updateAccountForRegistrationMutation(account, company), {headers: generateHeaders(this.getToken())}, {failStrategy: FailStrategy.Soft, ignoreSnack: true});
  }

  public hasPermissions(entity: string, operation: string): boolean {
    return this.getSixUser().hasPermissions(entity, operation, this.getActiveAcl());
  }

  public refreshAfterAcceptInvite(defaultAcl: Acl, isNewUser: boolean): void {
    if (defaultAcl && defaultAcl.id) {
      localStorage.setItem(this.activeAcl, JSON.stringify(defaultAcl));
      this.currentActiveAcl = defaultAcl;
    }

    localStorage.setItem(this.isInvitedUserKey, 'true');

    if (!this.authenticated()) {
      if (isNewUser) {
        this.logoutToSignup();
      } else {
        this.logout();
      }

      return;
    }

    this.updateUserData(JSON.parse(localStorage.getItem(this.idTokenPayload)));
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

  getUserIntrospection(profile: any, redirectUrl?: string): void {
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

          this.redirectAfterAclChange(redirectUrl);
        } else {
          this.logout();
        }
      }
    );
  }

  private redirectAfterAclChange(redirectUrl?: string) {
    if (this.shouldRedirectToRegister()) {
      this.router.navigateByUrl('/register');
      return;
    }

    if (this.shouldRedirectToAccountInfo()) {
      this.router.navigateByUrl('/account-info');
      return;
    }

    if (this.shouldRedirectToBillingDisabled()) {
      this.router.navigate(['/billing-disabled']);
      return;
    }

    if (redirectUrl) {
      this.router.navigateByUrl(redirectUrl);
      return;
    }

    if (this.shouldRedirectToDashboard()) {
      this.router.navigateByUrl(this.isActiveAclCustomerService() ? '/customer-service' : '/dashboard');
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
    return this.router.url === '/'
      || (this.router.url || '').indexOf('acceptinvite/') !== -1;
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
