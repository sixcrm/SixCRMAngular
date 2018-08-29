import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NavigationService} from '../../navigation/navigation.service';
import {MatDialog} from '@angular/material';

@Injectable()
export class RebillsAclGuard extends AbstractAclGuard implements CanActivate {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MatDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('rebill');
  }
}
