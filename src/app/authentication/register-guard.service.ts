import { Injectable } from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RegisterGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.active()
      && this.authService.getActiveAcl().account.active
      && !this.authService.getActiveAcl().account.hasBillingIssue()
      && !this.authService.getActiveAcl().account.isNew()
      && this.authService.getSixUser().acls.length > 0
    ) {
      return false;
    }

    let jwt = route.queryParams['jwt'];

    if (jwt) {
      let urlWithoutJWT = '/register' + (route.queryParams['redirect'] ? '?redirect='+route.queryParams['redirect'] : '');
      this.authService.logoutWithJwt(jwt, urlWithoutJWT);
      return false;
    }

    if (this.authService.authenticated()) {
      return true;
    }

    this.authService.logout();
  }
}
