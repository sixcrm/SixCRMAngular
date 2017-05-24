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

    if (this.authService.authenticatedAndActivated()) {
      return true;
    }

    this.authService.logout();
  }
}
