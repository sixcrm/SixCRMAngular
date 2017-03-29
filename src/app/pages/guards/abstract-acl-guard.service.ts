import {AuthenticationService} from '../../authentication/authentication.service';
import {Router} from '@angular/router';

export class AbstractAclGuard {

  constructor(private authService: AuthenticationService, private router: Router) { }

  hasPermission(aclRole: string): boolean {
    if (this.authService.hasPermissions(aclRole, 'view')) {
      return true;
    }

    this.router.navigateByUrl('/dashboard');
  }
}
