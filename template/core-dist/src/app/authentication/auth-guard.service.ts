import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean {
    if (this.authService.authenticatedAndActivated()) {
      return true;
    }

    this.authService.logout();
  }
}
