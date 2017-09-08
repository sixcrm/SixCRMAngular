import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {LoadBalancerViewComponent} from '../load-balancers-page/load-balancer-view/load-balancer-view.component';

@Injectable()
export class LoadBalancersAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<LoadBalancerViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('loadbalancer');
  }
}
