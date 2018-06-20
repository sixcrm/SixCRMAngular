import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NavigationService} from '../../navigation/navigation.service';
import {MatDialog} from '@angular/material';
import {CustomerAdvancedComponent} from '../customer-advanced-page/customer-advanced.component';

@Injectable()
export class CustomersAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<CustomerAdvancedComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MatDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('customer');
  }
}
