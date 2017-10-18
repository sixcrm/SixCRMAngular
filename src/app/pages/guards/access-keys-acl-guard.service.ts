import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {NavigationService} from '../../navigation/navigation.service';
import {AccessKeysViewComponent} from '../access-keys-page/access-keys-view/access-keys-view.component';

@Injectable()
export class AccessKeysAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<AccessKeysViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MdDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('accesskey');
  }
}
