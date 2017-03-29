import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean {
    if (this.authService.authenticated()) {
      return true;
    }

    this.authService.logout();
  }
}
