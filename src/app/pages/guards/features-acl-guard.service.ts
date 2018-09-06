import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AccountViewComponent} from '../accounts-page/account-view/account-view.component';
import {NavigationService} from '../../navigation/navigation.service';
import {MatDialog} from '@angular/material';

@Injectable()
export class FeaturesAclGuard implements CanActivate {

  constructor(private authService: AuthenticationService) { }

  canActivate(): boolean {
    return this.authService.isActiveOrActingAclMasterAccount();
  }
}
