import {Component, OnInit} from '@angular/core';
import {TabHeaderElement} from '../../../../shared/components/tab-header/tab-header.component';
import {RolesService} from '../../../../entity-services/services/roles.service';
import {RolesSharedService} from '../../../../entity-services/services/roles-shared.service';
import {ActivatedRoute, Params} from '@angular/router';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {Role} from '../../../../shared/models/role.model';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {
  getAllPermissionActions, getRestrictedPermissionEntities
} from '../../../../shared/models/permissions.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AclsService} from '../../../../entity-services/services/acls.service';
import {Acl} from '../../../../shared/models/acl.model';
import {AccountsService} from '../../../../entity-services/services/accounts.service';
import {BreadcrumbItem} from '../../../components/models/breadcrumb-item.model';

@Component({
  selector: 'account-management-role-view',
  templateUrl: './account-management-role-view.component.html',
  styleUrls: ['./account-management-role-view.component.scss']
})
export class AccountManagementRoleViewComponent implements OnInit {

  selectedIndex: number = 0;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'GENERAL'},
    {name: 'permissions', label: 'PERMISSIONS'},
    {name: 'users', label: 'USERS'}
  ];

  isShared: boolean;

  entityId: string;

  role: Role;
  roleBackup: Role;
  formInvalid: boolean;

  allActions: string[] = getAllPermissionActions();
  allEntities: string[] = getRestrictedPermissionEntities();
  visibleEntities: string[] = getRestrictedPermissionEntities();

  acls: Acl[];
  roleAcls: Acl[];
  otherAcls: Acl[];
  aclsRoleToBeChanged: Acl[] = [];

  roles: Role[];
  sharedRoles: Role[];

  filterString: string;
  filterEditString: string;
  filterFunction = (acl: Acl) => `${acl.user.email} ${acl.user.name}`;

  usersEditMode: boolean;

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Account Management'},
    {label: () => 'Roles'},
    {label: () => this.role ? this.role.name : ''}
  ];

  constructor(
    public authService: AuthenticationService,
    private service: RolesService,
    private sharedService: RolesSharedService,
    private activatedRoute: ActivatedRoute,
    private aclService: AclsService,
    private accountService: AccountsService
  ) {
    this.activatedRoute.params.take(1).subscribe((params: Params) => {
      this.entityId = params['id'];

      this.fetch();
    });
  }

  fetch() {
    this.accountService.entity$.take(1).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.acls = account.acls;
      this.roleAcls = this.acls.filter(acl => acl.role.id === this.entityId);
      this.otherAcls = this.acls.filter(acl => this.isOtherAcl(acl));
    });

    this.service.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles;
    });

    this.sharedService.entities$.take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.sharedRoles = roles.filter(r => !r.isOwner() && this.sharedService.isRoleAvailable(r));
    });

    this.service.entity$.take(1).subscribe(role => {
      if (role instanceof CustomServerError) return;

      if (role.id) {
        this.isShared = false;
        this.role = role;
        this.roleBackup = this.role.copy();
      } else {
        this.sharedService.getEntity(this.entityId);
      }
    });

    this.sharedService.entity$.take(1).subscribe(role => {
      if (role instanceof CustomServerError) return;

      if (role.id) {
        this.isShared = true;
        this.role = role;
        this.roleBackup = this.role.copy();
        this.service = this.sharedService;
      }
    });

    this.service.getEntity(this.entityId);
    this.service.getEntities();
    this.sharedService.getEntities();
    this.accountService.getEntity(this.authService.getActiveAcl().account.id);
  }

  ngOnInit() {

  }

  getAvatar(acl: Acl): string {
    const fn = acl.user.firstName;
    const ln = acl.user.lastName;

    return `${fn.length > 0 ? fn.charAt(0) : ''}${ln.length > 0 ? ln.charAt(0) : ''}`
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
    this.formInvalid = false;
  }

  cancel() {
    this.roleBackup = this.role.copy();
  }

  updateRoleName() {
    let toUpdate = this.role.copy();
    toUpdate.name = this.roleBackup.name;

    if (!toUpdate.name) {
      this.formInvalid = true;

      return;
    }

    this.service.entityUpdated$.take(1).subscribe(updatedRole => {
      if (updatedRole instanceof CustomServerError) return;

      this.role = updatedRole;
      this.roleBackup = this.role.copy();
      this.formInvalid = false;
    });

    this.service.updateEntity(toUpdate);
  }

  togglePermission(entity: string, action: string, value) {

    if (value.checked) {
      if (this.role.permissions.hasPermission(entity, action)) return;

      this.role.permissions.allow = [...this.role.permissions.allow, `${entity}/${action}`];
    } else {
      const exactIndex = firstIndexOf(this.role.permissions.allow, (allowed) => allowed === `${entity}/${action}`);

      if (exactIndex !== -1) {
        this.role.permissions.allow.splice(exactIndex, 1);
      }
    }
  }

  revertPermissions() {
    this.role.permissions.allow = this.roleBackup.permissions.allow.slice();
    this.role = this.role.copy();
  }

  savePermissions() {
    this.service.entityUpdated$.take(1).subscribe(role => {
      if (role instanceof CustomServerError) return;

      this.role = role;
      this.roleBackup = role;
    });

    this.service.updateEntity(this.role);
  }

  isChanged(): boolean {
    return this.role.permissions.allow.toString() !== this.roleBackup.permissions.allow.toString();
  }

  toggleAllPermissionsFor(entity: string, value) {
    for (let action of this.allActions) {
      this.togglePermission(entity, action, value)
    }
  }

  hasAllPermissionsFor(entity) {
    for (let action of this.allActions) {
      if (!this.role.permissions.hasPermission(entity,action)) return false;
    }

    return true;
  }

  enableAllActionsForAllEntities() {
    for (let action of this.allActions) {
      this.enableAllAction(action);
    }
  }

  disableAllActionsForAllEntities() {
    this.role.permissions.allow = [];
  }

  enableAllAction(action: string) {
    this.disableAllAction(action);

    for (let entity of this.allEntities) {
      this.role.permissions.allow.push(`${entity}/${action}`);
    }
  }

  disableAllAction(action: string) {
    this.role.permissions.allow = this.role.permissions.allow.filter(allowed => {
      const splitted = allowed.split('/');

      return splitted[1] !== action;
    })
  }

  toggleActiveOnly(value) {
    if (value.checked) {
      this.visibleEntities = this.allEntities.filter(entity => this.hasAtLeastOnePermission(entity)).slice();
    } else {
      this.visibleEntities = this.allEntities.slice();
    }
  }

  hasAtLeastOnePermission(entity: string) {
    for (let action of this.allActions) {
      if (this.role.hasPermission(entity, action)) return true;
    }

    return false;
  }

  updateAclRole(result: {acl: Acl, role: Role}) {
    this.aclService.entityUpdated$.take(1).subscribe((updatedAcl) => {
      if (updatedAcl instanceof CustomServerError) return;

      const index = firstIndexOf(this.acls, (el) => el.id === updatedAcl.id);

      if (index !== -1)  {
        this.acls[index] = updatedAcl;
        this.roleAcls = this.acls.filter(acl => acl.role.id === this.entityId);
        this.otherAcls = this.acls.filter(acl => this.isOtherAcl(acl));
      }
    });

    let backupAcl = result.acl.copy();
    backupAcl.role = result.role;

    this.aclService.updateEntity(backupAcl);
  }

  aclRoleToggle(acl: Acl, value) {
    if (value.checked) {
      this.aclsRoleToBeChanged.push(acl);
    } else {
      const index = firstIndexOf(this.aclsRoleToBeChanged, (el) => el.id === acl.id);

      if (index !== -1) {
        this.aclsRoleToBeChanged.splice(index, 1);
      }
    }
  }

  cancelAclRoleUpdate() {
    this.aclsRoleToBeChanged = [];
  }

  saveAclRoleUpdate() {
    for (let acl of this.aclsRoleToBeChanged) {
      this.aclService.entityUpdated$.take(this.aclsRoleToBeChanged.length).subscribe((updatedAcl) => {
        if (updatedAcl instanceof CustomServerError) return;

        const index = firstIndexOf(this.acls, (el) => el.id === updatedAcl.id);

        if (index !== -1)  {
          this.acls[index] = updatedAcl;
          this.roleAcls = this.acls.filter(acl => acl.role.id === this.entityId);
          this.otherAcls = this.acls.filter(acl => this.isOtherAcl(acl));
          this.aclsRoleToBeChanged = this.aclsRoleToBeChanged.filter(acl => acl.id !== updatedAcl.id);
        }
      });

      let backupAcl = acl.copy();
      backupAcl.role = this.role.copy();

      this.aclService.updateEntity(backupAcl);
    }

  }

  shouldAclRoleBeChanged(acl: Acl) {
    return firstIndexOf(this.aclsRoleToBeChanged, (el) => acl.id === el.id) !== -1;
  }

  private isOtherAcl(acl) {
    return acl.id !== this.authService.getActiveAcl().id
      && !acl.role.isOwner()
      && acl.role.id !== this.entityId
  }
}
