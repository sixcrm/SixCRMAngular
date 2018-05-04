import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable()
export class PaymentGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean {
    if (this.authService.getActiveAcl().role.name !== 'Owner') return false;

    if (!this.authService.getActiveAcl().account.billing || this.authService.getActiveAcl().account.billing.disable) {
      return true;
    }

    return false;
  }
}
