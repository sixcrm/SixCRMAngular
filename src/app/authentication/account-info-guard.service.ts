import { AuthenticationService } from './authentication.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AccountInfoGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean {
    return !this.authService.getActiveAcl().account.billing
      || this.authService.getSixUser().acls.length === 0
      || !this.authService.getActiveAcl().account.active
      || this.authService.getActiveAcl().role.isDisabled()
      || this.authService.getActiveAcl().role.isNoPermissions()
  }
}
