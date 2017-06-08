import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Router, CanActivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';

@Injectable()
export class AnalyticsAclGuard extends AbstractAclGuard implements CanActivate {

  constructor(authService: AuthenticationService, router: Router) {
    super(authService, router);
  }

  canActivate(): boolean {
    return super.hasPermission('analytics');
  }
}
