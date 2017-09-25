import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {LoadBalancerViewComponent} from '../load-balancers-page/load-balancer-view/load-balancer-view.component';
import {NavigationService} from '../../navigation/navigation.service';

@Injectable()
export class LoadBalancersAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<LoadBalancerViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MdDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('loadbalancer');
  }
}
