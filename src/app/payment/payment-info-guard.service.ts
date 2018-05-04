import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable()
export class PaymentInfoGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean {
    return this.authService.getActiveAcl().account.hasBillingIssue();
  }
}
