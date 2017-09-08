import {AuthenticationService} from '../../authentication/authentication.service';
import {Router} from '@angular/router';
import {YesNoDialogComponent} from '../yes-no-dialog.component';
import {MdDialog} from '@angular/material';

export class AbstractAclGuard {

  constructor(private authService: AuthenticationService, private router: Router, private dialog: MdDialog) { }

  hasPermission(aclRole: string): boolean {
    if (this.authService.hasPermissions(aclRole, 'view')) {
      return true;
    }

    this.router.navigateByUrl('/dashboard');
  }

  canDeactivate(component) {
    if (component.canBeDeactivated()) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      let yesNoDialogRef = this.dialog.open(YesNoDialogComponent, { disableClose : true });
      yesNoDialogRef.componentInstance.text = 'Are you sure you want to leave? You have unsaved changes, if you leave changes will be discarded. ';
      yesNoDialogRef.componentInstance.yesText = 'Proceed';
      yesNoDialogRef.componentInstance.noText = 'Cancel';

      yesNoDialogRef.afterClosed().take(1).subscribe(result => {
        yesNoDialogRef = null;

        if (result.success) {
          resolve(true);
        }

        resolve(false);
      });
    });
  }
}
