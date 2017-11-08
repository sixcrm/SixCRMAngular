import { Injectable } from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import {User} from '../shared/models/user.model';

@Injectable()
export class TermsAndConditionsGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user: User = this.authService.getSixUser();

    if (user.termsAndConditionsOutdated) {
      this.router.navigate(['/terms-and-conditions']);
      return false;
    }

    return true;
  }
}
