import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../shared/services/roles.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {ParsedPermission} from '../../../shared/models/permissions.model';

@Component({
  selector: 'role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.scss']
})
export class RoleViewComponent extends AbstractEntityViewComponent<Role> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'ROLE_TAB_GENERAL'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'ROLE_INDEX_TITLE', url: '/roles'},
    {label: () => this.entity.name}
  ];

  permissionsAllowedColumnParams: ColumnParams<ParsedPermission>[] = [];
  permissionsDeniedColumnParams: ColumnParams<ParsedPermission>[] = [];

  permissionsAllowedTextOptions: TableMemoryTextOptions = {
    title: 'ROLE_ALLOWED_TITLE',
    noDataText: 'ROLE_ALLOWED_NODATA',
    editOptionText: 'ROLE_ALLOWED_EDIT'
  };

  permissionsDeniedTextOptions: TableMemoryTextOptions = {
    title: 'ROLE_DENIED_TITLE',
    noDataText: 'ROLE_DENIED_NODATA',
    editOptionText: 'ROLE_DENIED_EDIT'
  };

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

    this.permissionsAllowedColumnParams = [
      new ColumnParams<ParsedPermission>('ROLE_INFO_OPTION').setMappingFunction((e: ParsedPermission) => e.action),
      new ColumnParams<ParsedPermission>('ROLE_INFO_PERMISSION').setMappingFunction((e: ParsedPermission) => e.permissions),
    ];

    this.permissionsDeniedColumnParams = [
      new ColumnParams<ParsedPermission>('ROLE_INFO_OPTION').setMappingFunction((e: ParsedPermission) => e.action),
      new ColumnParams<ParsedPermission>('ROLE_INFO_PERMISSION').setMappingFunction((e: ParsedPermission) => e.permissions),
    ];
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  ngOnDestroy() {
    this.destroy();
  }
}
