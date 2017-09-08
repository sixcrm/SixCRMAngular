import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Router, CanActivate, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {MdDialog} from '@angular/material';

@Injectable()
export class AnalyticsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<any> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('analytics');
  }
}
