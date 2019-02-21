import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NavigationService} from '../../navigation/navigation.service';
import {MatDialog} from '@angular/material';
import {SmsProviderViewComponent} from '../sms-providers-page/sms-provider-view/sms-provider-view.component';

@Injectable()
export class SmsProvidersAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<SmsProviderViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MatDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('smsprovider');
  }
}
