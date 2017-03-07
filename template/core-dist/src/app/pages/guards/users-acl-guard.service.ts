import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Injectable()
export class UsersAclGuard extends AbstractAclGuard implements CanActivate {

  constructor(authService: AuthenticationService, router: Router) {
    super(authService, router);
  }

  canActivate(): boolean {
    return super.hasPermission('user');
  }
}
