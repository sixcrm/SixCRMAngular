import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Role} from '../../../../shared/models/role.model';
import {RolesSharedService} from '../../../../shared/services/roles-shared.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Acl} from '../../../../shared/models/acl.model';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'roles-index-shared',
  templateUrl: './roles-index-shared.component.html',
  styleUrls: ['./roles-index-shared.component.scss']
})
export class RolesIndexSharedComponent extends AbstractEntityIndexComponent<Role> implements OnInit, OnDestroy {

  @Input() acls: Acl[] = [];

  constructor(
    service: RolesSharedService,
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
    this.viewAfterCrate = false;

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe(entity => {
      if (entity instanceof CustomServerError) return;

      this.viewEntity(entity.id, true)
    });

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

  viewEntity(id: string, noShared?: boolean): void {
    let params = [id];
    if (!noShared) params.unshift('shared');

    this.router.navigate(params, {relativeTo: this.activatedRoute});
  }

}
