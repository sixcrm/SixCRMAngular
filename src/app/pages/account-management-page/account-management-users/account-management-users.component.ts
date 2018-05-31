import {Component, OnInit, OnDestroy} from '@angular/core';
import {AccountsService} from '../../../shared/services/accounts.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Account} from '../../../shared/models/account.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Acl} from '../../../shared/models/acl.model';
import {RolesService} from '../../../shared/services/roles.service';
import {RolesSharedService} from '../../../shared/services/roles-shared.service';
import {Role} from '../../../shared/models/role.model';
import {AclsService} from '../../../shared/services/acls.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {DeleteDialogComponent} from '../../delete-dialog.component';
import {MatDialog} from '@angular/material';
import {InviteDialogComponent} from '../../../dialog-modals/invite-dialog/invite-dialog.component';
import {UsersService} from '../../../shared/services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'account-management-users',
  templateUrl: './account-management-users.component.html',
  styleUrls: ['./account-management-users.component.scss']
})
export class AccountManagementUsersComponent implements OnInit, OnDestroy {

  account: Account;
  filterString: string;
  filterFunction = (acl: Acl) => `${acl.user.email} ${acl.user.name} ${acl.role.name}`;

  roles: Role[] = [];
  sharedRoles: Role[] = [];

  accountSub: Subscription;

  constructor(
    private accountService: AccountsService,
    private authService: AuthenticationService,
    private rolesService: RolesService,
    private rolesSharedService: RolesSharedService,
    private aclService: AclsService,
    private dialog: MatDialog,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.accountSub = this.accountService.entity$.subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
    });

    this.rolesService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles;
    });

    this.rolesSharedService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.sharedRoles = roles;
    });

    this.accountService.getEntity(this.authService.getActiveAcl().account.id);
    this.rolesService.getEntities();
    this.rolesSharedService.getEntities();
  }

  ngOnDestroy() {
    if (this.accountSub) {
      this.accountSub.unsubscribe();
    }
  }

  deleteAcl(acl: Acl): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
      if (result && result.success) {
        this.performAclDelete(acl);
      }
    });
  }

  showInviteDialog(): void {
    let dialogRef = this.dialog.open(InviteDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.roles = this.roles;
    dialogRef.componentInstance.sharedRoles = this.sharedRoles;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result && result.email && result.role) {

        this.userService.sendUserInvite(result.email, result.firstName, result.lastName, result.role, this.account.id).take(1).subscribe(response => {
          if (response instanceof CustomServerError) return;

          this.accountService.getEntity(this.account.id);
        });

      }
    });
  }

  performAclDelete(acl: Acl) {
    this.aclService.entityDeleted$.take(1).subscribe(deletedAcl => {
      if (deletedAcl instanceof CustomServerError) return;

      const index = firstIndexOf(this.account.acls, (el: Acl) => el.id === deletedAcl.id);

      if (index !== -1) {
        this.account.acls.splice(index, 1);
      }
    });

    this.aclService.deleteEntity(acl.id);
  }

  getAvatar(acl: Acl): string {
    const fn = acl.user.firstName;
    const ln = acl.user.lastName;

    return `${fn.length > 0 ? fn.charAt(0) : ''}${ln.length > 0 ? ln.charAt(0) : ''}`
  }

  updateAclRole(acl: Acl, role: Role) {
    this.aclService.entityUpdated$.take(1).subscribe((updatedAcl) => {
      if (updatedAcl instanceof CustomServerError) return;

      const index = firstIndexOf(this.account.acls, (el: Acl) => el.id === updatedAcl.id);

      if (index !== -1) {
        this.account.acls[index] = updatedAcl;
        this.account.acls = this.account.acls.slice();
      }
    });

    let backupAcl = acl.copy();
    backupAcl.role = role;

    this.aclService.updateEntity(backupAcl);
  }

}
