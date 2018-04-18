import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NavigationService} from '../../navigation/navigation.service';
import {BillViewComponent} from '../bills-page/bill-view/bill-view.component';
import {MatDialog} from '@angular/material';

@Injectable()
export class BillsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<BillViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MatDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('bill') && this.authService.isActiveAclMasterAccount();
  }
}
