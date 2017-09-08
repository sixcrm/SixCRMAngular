import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {RebillViewComponent} from '../rebills-page/rebill-view/rebill-view.component';

@Injectable()
export class RebillsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<RebillViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('rebill');
  }
}
