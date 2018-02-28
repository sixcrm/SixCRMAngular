import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../shared/services/roles.service';
import {ColumnParams, ColumnParamsInputType} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {
  ParsedPermission, getAllPermissionEntities,
  getAllPermissionActions
} from '../../../shared/models/permissions.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';

@Component({
  selector: 'role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.scss']
})
export class RoleViewComponent extends AbstractEntityViewComponent<Role> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  tabHeaders: TabHeaderElement[] = [
    {name: 'permissions', label: 'ROLE_TAB_PERMISSIONS'},
    {name: 'acls', label: 'ROLE_TAB_ACLS'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'ROLE_INDEX_TITLE', url: '/roles'},
    {label: () => this.entity.name}
  ];

  permissionsColumnParams: ColumnParams<ParsedPermission>[] = [];

  permissionsAllowedTextOptions: TableMemoryTextOptions = {
    title: 'ROLE_ALLOWED_TITLE',
    noDataText: 'ROLE_ALLOWED_NODATA',
    editOptionText: 'ROLE_ALLOWED_EDIT',
    disassociateOptionText: 'ROLE_ALLOWED_DELETE'
  };

  permissionsDeniedTextOptions: TableMemoryTextOptions = {
    title: 'ROLE_DENIED_TITLE',
    noDataText: 'ROLE_DENIED_NODATA',
    editOptionText: 'ROLE_DENIED_EDIT',
    disassociateOptionText: 'ROLE_DENIED_DELETE'
  };

  permissionFactory = () => new ParsedPermission();

  constructor(
    service: RolesService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.permissionsColumnParams = [
      new ColumnParams<ParsedPermission>('ROLE_INFO_OPTION')
        .setMappingFunction((e: ParsedPermission) => e.action)
        .setAssigningFunction((e: ParsedPermission, value) => e.action = value)
        .setValidator((e: ParsedPermission) => !!e.action)
        .setInputType(ColumnParamsInputType.AUTOCOMPLETE)
        .setAutofocus(true)
        .setAutocompleteOptions(getAllPermissionEntities())
        .setAutocompleteInitialValue((e: ParsedPermission) => e.action),
      new ColumnParams<ParsedPermission>('ROLE_INFO_PERMISSION').setMappingFunction((e: ParsedPermission) => e.permissions)
        .setMappingFunction((e: ParsedPermission) => e.permissions)
        .setAssigningFunction((e: ParsedPermission, value) => e.permissions = value)
        .setValidator((e: ParsedPermission) => !!e.permissions)
        .setInputType(ColumnParamsInputType.AUTOCOMPLETE)
        .setAutocompleteOptions(getAllPermissionActions())
        .setAutocompleteInitialValue((e: ParsedPermission) => e.permissions),
    ];
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  ngOnDestroy() {
    this.destroy();
  }

  addAllowed(permission: ParsedPermission) {
    this.entity.permissions.allow.push(`${permission.action}/${permission.permissions}`);

    this.updateEntity(this.entity);
  }

  updateAllowed(permission: ParsedPermission) {
    const index = this.getFirstIndexOf(this.entity.permissions.parsedAllowed, permission);

    if (index !== -1) {
      this.entity.permissions.allow[index] = `${permission.action}/${permission.permissions}`;
    }

    this.updateEntity(this.entity);
  }

  deleteAllowed(permission: ParsedPermission) {
    const index = this.getFirstIndexOf(this.entity.permissions.parsedAllowed, permission);

    if (index !== -1) {
      this.entity.permissions.allow.splice(index, 1);
    }

    this.updateEntity(this.entity);
  }

  deleteManyAllowed(permissions: ParsedPermission[]) {
    permissions.forEach(permission => {
      const index = this.getFirstIndexOf(this.entity.permissions.parsedAllowed, permission);

      if (index !== -1) {
        this.entity.permissions.allow.splice(index, 1);
        this.entity.permissions.parsedAllowed.splice(index, 1);
      }
    });

    this.updateEntity(this.entity);
  }

  addDenied(permission: ParsedPermission) {
    this.entity.permissions.deny.push(`${permission.action}/${permission.permissions}`);

    this.updateEntity(this.entity);
  }

  updateDenied(permission: ParsedPermission) {
    const index = this.getFirstIndexOf(this.entity.permissions.parsedDenied, permission);

    if (index !== -1) {
      this.entity.permissions.deny.splice(index, 1);
    }

    this.updateEntity(this.entity);
  }

  deleteDenied(permission: ParsedPermission) {
    const index = this.getFirstIndexOf(this.entity.permissions.parsedDenied, permission);

    if (index !== -1) {
      this.entity.permissions.deny.splice(index, 1);
    }

    this.updateEntity(this.entity);
  }

  deleteManyDenied(permissions: ParsedPermission[]) {
    permissions.forEach(permission => {
      const index = this.getFirstIndexOf(this.entity.permissions.parsedDenied, permission);

      if (index !== -1) {
        this.entity.permissions.deny.splice(index, 1);
        this.entity.permissions.parsedDenied.splice(index, 1);
      }
    });

    this.updateEntity(this.entity);
  }

  getFirstIndexOf(permissions: ParsedPermission[], permission) {
    return firstIndexOf(permissions, (e) => e['tableAdvancedIdentifier'] === permission['tableAdvancedIdentifier'])
  }
}
