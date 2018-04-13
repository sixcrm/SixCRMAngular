import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NavigationService} from '../../navigation/navigation.service';
import {MerchantProviderGroupViewComponent} from '../merchant-provider-groups-page/merchant-provider-group-view/merchant-provider-group-view.component';
import {MatDialog} from '@angular/material';

@Injectable()
export class MerchantProviderGroupsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<MerchantProviderGroupViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MatDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('merchantprovidergroup');
  }
}
