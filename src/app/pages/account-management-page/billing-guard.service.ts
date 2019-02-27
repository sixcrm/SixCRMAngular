import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import {AuthenticationService} from '../../authentication/authentication.service';

@Injectable()
export class BillingGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !this.authService.getActiveAccount().isFreePlan();
  }
}
