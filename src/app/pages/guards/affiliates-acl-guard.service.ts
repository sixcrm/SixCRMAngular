import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {AffiliateViewComponent} from '../affiliates-page/affiliate-view/affiliate-view.component';

@Injectable()
export class AffiliatesAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<AffiliateViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('affiliate');
  }
}
