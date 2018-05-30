import { Component, OnInit } from '@angular/core';
import {Account} from '../../../shared/models/account.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../shared/services/roles.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {RolesSharedService} from '../../../shared/services/roles-shared.service';
import {Acl} from '../../../shared/models/acl.model';
import {AclsService} from '../../../shared/services/acls.service';

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
    private aclService: AclsService
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

  addNewRole() {

  }

  viewRole(role: Role) {

  }

  deleteRole(role: Role) {

  }
}
