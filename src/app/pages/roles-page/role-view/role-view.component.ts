import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../entity-services/services/roles.service';
import {ColumnParams, ColumnParamsInputType} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {
  ParsedPermission, getAllPermissionEntities,
  getAllPermissionActions
} from '../../../shared/models/permissions.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {RolesSharedService} from '../../../entity-services/services/roles-shared.service';
import {AclsService} from '../../../entity-services/services/acls.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

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

  permissionFactory = () => new ParsedPermission();

  isShared: boolean;

  images: string[];

  constructor(
    service: RolesService,
    private sharedService: RolesSharedService,
    private activatedRoute: ActivatedRoute,
    public navigation: NavigationService,
    public router: Router,
    private aclService: AclsService
  ) {
    super(service, activatedRoute);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(data => {
      if (data[0].path === 'shared') {
        this.service = this.sharedService;
        this.isShared = true;
      }

      this.init(() => this.navigation.goToNotFoundPage());
    });

    this.permissionsColumnParams = [
      new ColumnParams<ParsedPermission>('ROLE_INFO_OPTION')
        .setMappingFunction((e: ParsedPermission) => e.action)
        .setAssigningFunction((e: ParsedPermission, value) => e.action = value)
        .setValidator((e: ParsedPermission) => !!e.action)
        .setInputType(ColumnParamsInputType.AUTOCOMPLETE)
        .setAutofocus(true)
        .setAutocompleteOptions(getAllPermissionEntities())
        .setAutocompleteInitialValue((e: ParsedPermission) => e.action),
      new ColumnParams<ParsedPermission>('ROLE_INFO_PERMISSION')
        .setMappingFunction((e: ParsedPermission) => e.permissions)
        .setAssigningFunction((e: ParsedPermission, value) => {
          e.permissions = value.map(v => v.value).join(' ');

          return e;
        })
        .setValidator((e: ParsedPermission) => !!e.permissions)
        .setInputType(ColumnParamsInputType.MULTISELECT)
        .setAutocompleteOptions(getAllPermissionActions())
        .setAutocompleteInitialValue((e: ParsedPermission) => e.permissions ? [e.permissions] : []),
    ];

    this.aclService.entities$.takeUntil(this.unsubscribe$).subscribe(data => {
      if (data instanceof CustomServerError) return;

      this.images = data.filter(acl => acl.role.id === this.entityId).map(acl => acl.user.getDefaultImage());
    });
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  ngOnDestroy() {
    this.destroy();
  }

  addAllowed(permission: ParsedPermission) {
    if (permission.permissions === getAllPermissionActions().join(' ')) {
      this.entity.permissions.allow.push(`${permission.action}/*`);
    } else {
      permission.permissions.split(' ').forEach(i => this.entity.permissions.allow.push(`${permission.action}/${i}`));
    }

    this.updateEntity(this.entity);
  }

  updateAllowed(permission: ParsedPermission) {
    const delPerm = new ParsedPermission(permission.action, getAllPermissionActions().join(' '));

    this.deleteAllowed(delPerm, true);
    this.addAllowed(permission);
  }

  deleteAllowed(permission: ParsedPermission, noUpdate?: boolean) {
    let perms = ['*', ...getAllPermissionActions()];
    if (permission.permissions !== getAllPermissionActions().join(' ')) {
      perms = permission.permissions.split(' ');
    }

    perms.forEach(p => {
      const index = this.firstIndex(this.entity.permissions.allow, permission.action, p);

      if (index !== -1) {
        this.entity.permissions.allow.splice(index, 1);
      }
    });

    if (noUpdate) return;

    this.updateEntity(this.entity);
  }

  deleteManyAllowed(permissions: ParsedPermission[]) {
    permissions.forEach(permission => {
      this.deleteAllowed(permission, true);
    });

    this.updateEntity(this.entity);
  }

  firstIndex(array, action, permission) {
    return firstIndexOf(array, (a) => a === `${action}/${permission}`)
  }
}
