import {AuthenticationService} from '../../authentication/authentication.service';
import {Router} from '@angular/router';
import {YesNoDialogComponent} from '../yes-no-dialog.component';
import {NavigationService} from '../../navigation/navigation.service';
import {MatDialog} from '@angular/material';

export class AbstractAclGuard {

  constructor(protected authService: AuthenticationService,
              private router: Router,
              private dialog: MatDialog,
              private navigation?: NavigationService
  ) { }

  hasPermission(aclRole: string): boolean {
    if (this.authService.hasPermissions(aclRole, 'read')) {
      return true;
    }

    this.router.navigateByUrl(this.authService.isBillingDisabled() ? '/billing-disabled': '/dashboard');
  }

  canDeactivate(component): Promise<boolean> {
    if (component.canBeDeactivated()) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      let yesNoDialogRef = this.dialog.open(YesNoDialogComponent, { disableClose : true });
      yesNoDialogRef.componentInstance.text = 'SINGLEPAGE_LEAVETITLE';
      yesNoDialogRef.componentInstance.secondaryText = 'SINGLEPAGE_LEAVETEXT';
      yesNoDialogRef.componentInstance.yesText = 'SINGLEPAGE_LEAVELEAVE';
      yesNoDialogRef.componentInstance.noText = 'SINGLEPAGE_LEAVECANCEL';

      yesNoDialogRef.afterClosed().take(1).subscribe(result => {
        yesNoDialogRef = null;

        if (result.success) {
          resolve(true);

        } else {
          if (this.navigation) {
            this.navigation.revertLocation();
          }
          resolve(false);
        }
      });
    });
  }
}
