import {Component, OnInit, OnDestroy} from '@angular/core';
import {AccountsService} from '../../../entity-services/services/accounts.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Account} from '../../../shared/models/account.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Acl} from '../../../shared/models/acl.model';
import {RolesService} from '../../../entity-services/services/roles.service';
import {RolesSharedService} from '../../../entity-services/services/roles-shared.service';
import {Role} from '../../../shared/models/role.model';
import {AclsService} from '../../../entity-services/services/acls.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {DeleteDialogComponent} from '../../delete-dialog.component';
import {MatDialog} from '@angular/material';
import {InviteDialogComponent} from '../../../dialog-modals/invite-dialog/invite-dialog.component';
import {UsersService} from '../../../entity-services/services/users.service';
import {Subscription} from 'rxjs';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'account-management-users',
  templateUrl: './account-management-users.component.html',
  styleUrls: ['./account-management-users.component.scss']
})
export class AccountManagementUsersComponent implements OnInit, OnDestroy {

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Account Management'},
    {label: () => 'Users'}
  ];

  account: Account;
  filterString: string;
  filterFunction = (acl: Acl) => `${acl.user.email} ${acl.user.name} ${acl.role.name}`;

  roles: Role[] = [];
  sharedRoles: Role[] = [];

  accountSub: Subscription;

  sortBy: {label: string, sortFunction: (f: Acl, s: Acl) => number}[] = [
    {label: 'First Name', sortFunction: (f: Acl, s: Acl) => {
      if ((f.user.firstName || '').toLowerCase() < (s.user.firstName || '').toLowerCase()) return -1;
      if ((f.user.firstName || '').toLowerCase() > (s.user.firstName || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Last Name', sortFunction: (f: Acl, s: Acl) => {
      if ((f.user.lastName || '').toLowerCase() < (s.user.lastName || '').toLowerCase()) return -1;
      if ((f.user.lastName || '').toLowerCase() > (s.user.lastName || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Email', sortFunction: (f: Acl, s: Acl) => {
      if ((f.user.email || '').toLowerCase() < (s.user.email || '').toLowerCase()) return -1;
      if ((f.user.email || '').toLowerCase() > (s.user.email || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Role Name', sortFunction: (f: Acl, s: Acl) => {
      if ((f.role.name || '').toLowerCase() < (s.role.name || '').toLowerCase()) return -1;
      if ((f.role.name || '').toLowerCase() > (s.role.name || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Created at', sortFunction: (f: Acl, s: Acl) => {
      if (f.createdAt.isBefore(s.createdAt)) return -1;
      if (f.createdAt.isAfter(s.createdAt)) return 1;
      return 0;
    }}
  ];

  selectedSortBy: {label: string, sortFunction: (f: Acl, s: Acl) => number};

  constructor(
    public authService: AuthenticationService,
    private accountService: AccountsService,
    private rolesService: RolesService,
    private rolesSharedService: RolesSharedService,
    private aclService: AclsService,
    private dialog: MatDialog,
    public userService: UsersService
  ) { }

  ngOnInit() {
    this.accountSub = this.accountService.entity$.subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.account = account;
    });

    this.rolesService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles.filter(r => !r.isOwner());
    });

    this.rolesSharedService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.sharedRoles = roles.filter(r => !r.isOwner() && this.rolesSharedService.isRoleAvailable(r));
    });

    this.accountService.getEntity(this.authService.getActiveAccount().id);
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
        this.account.acls = this.account.acls.slice();
      }
    });

    this.aclService.deleteEntity(acl.id);
  }

  getAvatar(acl: Acl): string {
    const fn = acl.user.firstName;
    const ln = acl.user.lastName;

    return `${fn.length > 0 ? fn.charAt(0) : ''}${ln.length > 0 ? ln.charAt(0) : ''}`
  }

  updateAclRole(result: {acl: Acl, role: Role}) {
    this.aclService.entityUpdated$.take(1).subscribe((updatedAcl) => {
      if (updatedAcl instanceof CustomServerError) return;

      const index = firstIndexOf(this.account.acls, (el: Acl) => el.id === updatedAcl.id);

      if (index !== -1) {
        this.account.acls[index] = updatedAcl;
        this.account.acls = this.account.acls.slice();
      }
    });

    let backupAcl = result.acl.copy();
    backupAcl.role = result.role;

    this.aclService.updateEntity(backupAcl);
  }

  applySortBy(sort: {label: string, sortFunction: (f: Acl, s: Acl) => number}) {
    this.selectedSortBy = sort;
    this.account.acls = this.account.acls.sort(sort.sortFunction);
  }

  resendInvite(acl: Acl): void {
    this.userService.resendUserInvite(acl).subscribe(response => {
      if (response instanceof CustomServerError) {
        return;
      }
    });
  }

}
