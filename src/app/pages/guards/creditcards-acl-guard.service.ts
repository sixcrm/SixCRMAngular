import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {NavigationService} from '../../navigation/navigation.service';

@Injectable()
export class CreditCardsAclGuard extends AbstractAclGuard implements CanActivate {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MdDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('creditcard');
  }
}
