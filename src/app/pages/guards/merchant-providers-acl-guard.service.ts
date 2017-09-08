import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {MerchantProviderViewComponent} from '../merchant-providers-page/merchant-provider-view/merchant-provider-view.component';

@Injectable()
export class MerchantProvidersAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<MerchantProviderViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('merchantprovider');
  }
}
