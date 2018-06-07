import { Component, OnInit } from '@angular/core';
import {Account} from '../../../shared/models/account.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../shared/services/roles.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {RolesSharedService} from '../../../shared/services/roles-shared.service';
import {Acl} from '../../../shared/models/acl.model';
import {MatDialog} from '@angular/material';
import {RoleDialogComponent} from '../../../dialog-modals/role-dialog/role-dialog.component';
import {DeleteDialogComponent} from '../../delete-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Router} from '@angular/router';
import {AccountsService} from '../../../shared/services/accounts.service';

@Component({
  selector: 'account-management-roles',
  templateUrl: './account-management-roles.component.html',
  styleUrls: ['./account-management-roles.component.scss']
})
export class AccountManagementRolesComponent implements OnInit {

  account: Account;

  roles: Role[];
  sharedRoles: Role[];

  allRoles: Role[];

  filterString: string;
  filterFunction = (role: Role) => role.name;

  acls: Acl[];

  sortBy: {label: string, sortFunction: (f: Role, s: Role) => number}[] = [
    {label: 'Name', sortFunction: (f: Role, s: Role) => {
      if ((f.name || '').toLowerCase() < (s.name || '').toLowerCase()) return -1;
      if ((f.name || '').toLowerCase() > (s.name || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'System', sortFunction: (f: Role, s: Role) => {
      if (f.isShared && !s.isShared) return -1;
      if (!f.isShared && s.isShared) return 1;
      return 0;
    }},
    {label: 'Number of Users', sortFunction: (f: Role, s: Role) => {
      if (this.getNumberOfUsers(f) > this.getNumberOfUsers(s)) return -1;
      if (this.getNumberOfUsers(f) < this.getNumberOfUsers(s)) return 1;
      return 0;
    }},
    {label: 'Created at', sortFunction: (f: Role, s: Role) => {
      if (f.createdAt.isBefore(s.createdAt)) return -1;
      if (f.createdAt.isAfter(s.createdAt)) return 1;
      return 0;
    }}
  ];

  selectedSortBy: {label: string, sortFunction: (f: Role, s: Role) => number};

  constructor(
    private authService: AuthenticationService,
    private roleService: RolesService,
    private roleSharedService: RolesSharedService,
    private accountService: AccountsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.account = this.authService.getActiveAcl().account;

    this.roleService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles.map(r => {
        r.isShared = false;

        return r;
      });

      if (this.sharedRoles) {
        this.allRoles = [...this.sharedRoles, ...this.roles];
      }
    });

    this.roleSharedService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.sharedRoles = roles.map(r => {
        r.isShared = true;

        return r;
      });


      if (this.roles) {
        this.allRoles = [...this.sharedRoles, ...this.roles];
      }
    });


    this.accountService.entity$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.acls = account.acls;
    });

    this.roleService.getEntities();
    this.roleSharedService.getEntities();
    this.accountService.getEntity(this.authService.getActiveAccount().id);
  }

  getNumberOfUsers(role: Role): number {
    if (!this.acls) return 0;

    return this.acls.filter(acl => acl.role.id === role.id).length;
  }

  addNewRole(): void {
    let dialogRef = this.dialog.open(RoleDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result && result.name) {
        this.roleService.entityCreated$.take(1).subscribe(role => {
          if (role instanceof CustomServerError) return;

          this.roles = [role, ...this.roles];
          this.allRoles = [...this.sharedRoles, ...this.roles];
        });

        this.roleService.createEntity(new Role({name: result.name, active: true}));
      }
    });
  }

  viewRole(role: Role) {
    this.router.navigate(['/accountmanagement', 'roles', role.id])
  }

  deleteRole(role: Role) {
    let dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
      if (result && result.success) {
        this.performRoleDelete(role);
      }
    });
  }

  performRoleDelete(role: Role) {
    this.roleService.entityDeleted$.take(1).subscribe(deletedRole => {
      if (deletedRole instanceof CustomServerError) return;

      const index = firstIndexOf(this.roles, (el: Role) => el.id === deletedRole.id);

      if (index !== -1) {
        this.roles.splice(index, 1);
        this.allRoles = [...this.sharedRoles, ...this.roles];
      }
    });

    this.roleService.deleteEntity(role.id);
  }

  applySortBy(sort: {label: string, sortFunction: (f: Role, s: Role) => number}) {
    this.selectedSortBy = sort;
    this.allRoles = this.allRoles.sort(sort.sortFunction);
  }
}
