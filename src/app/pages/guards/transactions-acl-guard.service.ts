import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {TransactionViewComponent} from '../transactions-page/transaction-view/transaction-view.component';
import {NavigationService} from '../../navigation/navigation.service';

@Injectable()
export class TransactionsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<TransactionViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MdDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('transaction');
  }
}
