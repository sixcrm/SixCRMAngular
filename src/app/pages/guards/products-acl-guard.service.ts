import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ProductViewComponent} from '../products-page/product-view/product-view.component';
import {MdDialog} from '@angular/material';

@Injectable()
export class ProductsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<ProductViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('product');
  }
}
