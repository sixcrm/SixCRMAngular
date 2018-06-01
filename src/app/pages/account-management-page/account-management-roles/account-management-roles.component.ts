import { Component, OnInit } from '@angular/core';
import {Account} from '../../../shared/models/account.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../shared/services/roles.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {RolesSharedService} from '../../../shared/services/roles-shared.service';
import {Acl} from '../../../shared/models/acl.model';
import {AclsService} from '../../../shared/services/acls.service';
import {MatDialog} from '@angular/material';
import {RoleDialogComponent} from '../../../dialog-modals/role-dialog/role-dialog.component';
import {DeleteDialogComponent} from '../../delete-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Router} from '@angular/router';

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

  constructor(
    private authService: AuthenticationService,
    private roleService: RolesService,
    private roleSharedService: RolesSharedService,
    private aclService: AclsService,
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


    this.aclService.entities$.take(1).subscribe(acls => {
      if (acls instanceof CustomServerError) return;

      this.acls = acls;
    });

    this.roleService.getEntities();
    this.roleSharedService.getEntities();
    this.aclService.getEntities();
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
}
