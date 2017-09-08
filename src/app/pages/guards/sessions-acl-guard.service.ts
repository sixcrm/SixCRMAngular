import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {SessionViewComponent} from '../sessions-page/session-view/session-view.component';

@Injectable()
export class SessionsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<SessionViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('session');
  }
}
