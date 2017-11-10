import { Injectable } from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let jwt = route.queryParams['jwt'];

    if (jwt) {
      let urlWithoutJWT = state.url.substr(0, state.url.indexOf('?jwt='));
      this.authService.logoutWithJwt(jwt, urlWithoutJWT);
      return false;
    }

    if (this.isLandingOnDashboardCorrectly(state) || this.isLandingOnTermsAndConditionsCorrectly(state)) {
      return true;
    }

    if (this.authService.authenticatedAndActivated()) {
      return true;
    }

    this.authService.logout(state.url);
  }

  isLandingOnDashboardCorrectly(state: RouterStateSnapshot) {
    return state.url.indexOf('/dashboard') !== -1 && this.authService.authenticated()
  }

  isLandingOnTermsAndConditionsCorrectly(state: RouterStateSnapshot) {
    return state.url.indexOf('/terms-and-conditions') !== -1 && this.authService.authenticated()
  }
}
