import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class MasterAccountGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean {
    return this.authService.isActiveOrActingAclMasterAccount();
  }
}
