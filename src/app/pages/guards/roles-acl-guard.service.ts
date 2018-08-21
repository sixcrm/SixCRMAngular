import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NavigationService} from '../../navigation/navigation.service';
import {MatDialog} from '@angular/material';
import {RoleViewComponent} from '../roles-page/role-view/role-view.component';

@Injectable()
export class RolesAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<RoleViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MatDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return this.authService.isActiveOrActingAclMasterAccount();
  }
}
