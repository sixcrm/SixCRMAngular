import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {Role} from '../../../../shared/models/role.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {RolesService} from '../../../../shared/services/roles.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MatDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Acl} from '../../../../shared/models/acl.model';

@Component({
  selector: 'roles-index-custom',
  templateUrl: './roles-index-custom.component.html',
  styleUrls: ['./roles-index-custom.component.scss']
})
export class RolesIndexCustomComponent extends AbstractEntityIndexComponent<Role> implements OnInit, OnDestroy {

  @Input() acls: Acl[] = [];

  @Output() addSelected: EventEmitter<boolean> = new EventEmitter();

  constructor(
    service: RolesService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams<Role>('ROLE_INDEX_HEADER_ID').setMappingFunction((e: Role) => e.id).setSelected(false),
      new ColumnParams<Role>('ROLE_INDEX_HEADER_NAME').setMappingFunction((e: Role) => e.name),
      new ColumnParams<Role>('ROLE_INDEX_HEADER_ACTIVE').setMappingFunction((e: Role) => e.active),
      new ColumnParams<Role>('ROLE_INDEX_HEADER_USERNUM').setMappingFunction((e: Role) => (this.acls || []).filter(a => a.role.id === e.id).length).setAlign('right'),
      new ColumnParams<Role>('ROLE_INDEX_HEADER_CREATED').setMappingFunction((e: Role) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams<Role>('ROLE_INDEX_HEADER_UPDATED').setMappingFunction((e: Role) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  copyRole(role: Role) {
    const r = role.copy();
    r.name = r.name + ' Copy';

    this.createEntity(r);
  }

}
