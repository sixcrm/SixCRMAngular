import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';

@Injectable()
export class CreditCardsAclGuard extends AbstractAclGuard implements CanActivate {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('creditcard');
  }
}
