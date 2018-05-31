import {Component, OnInit} from '@angular/core';
import {TabHeaderElement} from '../../../../shared/components/tab-header/tab-header.component';
import {RolesService} from '../../../../shared/services/roles.service';
import {RolesSharedService} from '../../../../shared/services/roles-shared.service';
import {ActivatedRoute, Params} from '@angular/router';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {Role} from '../../../../shared/models/role.model';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {
  getAllPermissionActions, getRestrictedPermissionEntities
} from '../../../../shared/models/permissions.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'account-management-role-view',
  templateUrl: './account-management-role-view.component.html',
  styleUrls: ['./account-management-role-view.component.scss']
})
export class AccountManagementRoleViewComponent implements OnInit {

  path = ['Roles'];
  value: string;

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

  constructor(
    public authService: AuthenticationService,
    private service: RolesService,
    private sharedService: RolesSharedService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.take(1).subscribe((params: Params) => {
      this.entityId = params['id'];

      this.fetch();
    });
  }

  fetch() {
    this.service.entity$.take(1).subscribe(role => {
      if (role instanceof CustomServerError) return;

      if (role.id) {
        this.isShared = false;
        this.role = role;
        this.roleBackup = this.role.copy();
        this.path = ['Roles', this.role.name];
        this.value = this.role.name;
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
        this.path = ['Roles', this.role.name];
        this.value = this.role.name;
      }
    });

    this.service.getEntity(this.entityId);
  }

  ngOnInit() {

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
      this.path = ['Roles', this.role.name];
      this.value = this.role.name;
    });

    this.service.updateEntity(toUpdate);
  }

  togglePermission(entity: string, action: string, value) {

    if (value.checked) {
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
}
