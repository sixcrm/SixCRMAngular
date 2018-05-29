import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../../../shared/models/user.model';
import {UsersService} from '../../../../shared/services/users.service';
import {AbstractEntityViewComponent} from '../../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {Role} from '../../../../shared/models/role.model';
import {RolesService} from '../../../../shared/services/roles.service';
import {RolesSharedService} from '../../../../shared/services/roles-shared.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {Acl} from '../../../../shared/models/acl.model';
import {AclsService} from '../../../../shared/services/acls.service';

@Component({
  selector: 'account-management-user-view',
  templateUrl: './account-management-user-view.component.html',
  styleUrls: ['./account-management-user-view.component.scss']
})
export class AccountManagementUserViewComponent extends AbstractEntityViewComponent<User> implements OnInit, OnDestroy {

  path: string[] = ['Users'];
  value: string;

  roles: Role[] = [];
  sharedRoles: Role[] = [];
  selectedRole: Role;
  originalAcl: Acl;
  accountId: string;
  formInvalid: boolean;

  constructor(
    service: UsersService,
    route: ActivatedRoute,
    private rolesService: RolesService,
    private rolesSharedService: RolesSharedService,
    private authService: AuthenticationService,
    private aclService: AclsService
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init();

    this.accountId = this.authService.getActiveAcl().account.id;

    this.service.entity$.takeUntil(this.unsubscribe$).subscribe(user => {
      if (user instanceof CustomServerError) return;

      this.path = ['Users', user.name];
      this.value = user.name;

      const index = firstIndexOf(user.acls, (acl: Acl) => acl.account.id === this.accountId);

      if (index !== -1) {
        this.originalAcl = user.acls[index];
        this.selectedRole = this.originalAcl.role.copy();
      }
    });

    this.rolesService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles;
    });

    this.rolesSharedService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.sharedRoles = roles;
    });

    this.rolesService.getEntities();
    this.rolesSharedService.getEntities();
  }

  setRole(role: Role) {
    this.selectedRole = role;
  }

  ngOnDestroy() {
    super.destroy();
  }

  cancelUserUpdate() {
    this.entityBackup = this.entity.copy();

    this.selectedRole = this.originalAcl.role.copy()
  }

  updateUser() {
    if (!this.entityBackup.firstName || !this.entityBackup.lastName) {
      this.formInvalid = true;
      return;
    }

    if (this.entity.firstName !== this.entityBackup.firstName || this.entity.lastName !== this.entityBackup.lastName) {

      this.service.entityUpdated$.take(1).subscribe(user => {
        if (user instanceof CustomServerError) return;

        this.value = `${user.firstName} ${user.lastName}`;

        if (this.selectedRole.id !== this.originalAcl.role.id) {
          this.updateRole();
        }
      });

      this.entityBackup.name = `${this.entityBackup.firstName} ${this.entityBackup.lastName}`;
      this.service.updateEntity(this.entityBackup);

    } else if (this.selectedRole.id !== this.originalAcl.role.id) {
      this.updateRole();
    }
  }

  updateRole() {
    this.aclService.entityUpdated$.take(1).subscribe(acl => {
      if (acl instanceof CustomServerError) return;

      this.originalAcl = acl.copy();
      this.selectedRole = acl.role.copy();
    });

    let updatedAcl = this.originalAcl.copy();
    updatedAcl.role = this.selectedRole.copy();

    this.aclService.updateEntity(updatedAcl);
  }

}
