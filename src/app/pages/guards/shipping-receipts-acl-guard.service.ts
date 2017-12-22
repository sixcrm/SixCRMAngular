import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {NavigationService} from '../../navigation/navigation.service';
import {ShippingReceiptViewComponent} from '../shipping-receipts-page/shipping-receipts-view/shipping-receipt-view.component';

@Injectable()
export class ShippingReceiptsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<ShippingReceiptViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MdDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('shippingreceipt');
  }
}
