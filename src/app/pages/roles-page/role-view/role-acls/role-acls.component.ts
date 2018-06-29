import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Acl} from '../../../../shared/models/acl.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {AclsService} from '../../../../entity-services/services/acls.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams, ColumnParamsInputType} from '../../../../shared/models/column-params.model';
import {Role} from '../../../../shared/models/role.model';
import {TableMemoryTextOptions} from '../../../components/table-memory/table-memory.component';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {YesNoDialogComponent} from '../../../yes-no-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'role-acls',
  templateUrl: './role-acls.component.html',
  styleUrls: ['./role-acls.component.scss']
})
export class RoleAclsComponent extends AbstractEntityIndexComponent<Acl> implements OnInit, OnDestroy {

  @Input() role: Role;

  aclTextOptions: TableMemoryTextOptions = {
    title: 'ROLE_ACL_TITLE',
    noDataText: 'ROLE_ACL_NODATA',
    disassociateOptionText: 'ROLE_ACL_DELETE'
  };

  aclFactory: () => Acl;
  filteredAcls: Acl[] = [];

  constructor(
    service: AclsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);

    this.aclFactory = () => new Acl({role: this.role.copy(), account: this.authService.getActiveAcl().account.copy()});

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams<Acl>('ROLE_ACL_ID').setMappingFunction((e: Acl) => e.id).setSelected(false).setEditable(false),
      new ColumnParams<Acl>('ROLE_ACL_IMAGE')
        .setMappingFunction((e: Acl) => '/assets/images/user-image-placeholder.svg')
        .setShowLabel(false)
        .setSortEnabled(false)
        .setInputType(ColumnParamsInputType.IMAGE),
      new ColumnParams<Acl>('ROLE_ACL_USER').setMappingFunction((e: Acl) => e.user.name).setAutofocus(true),
      new ColumnParams<Acl>('ROLE_ACL_CREATED').setMappingFunction((e: Acl) => e.createdAt.tz(f).format('MM/DD/YYYY')).setEditable(false),
      new ColumnParams<Acl>('ROLE_ACL_UPDATED').setMappingFunction((e: Acl) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false).setEditable(false)
    ];
  }

  ngOnInit() {
    this.shareLimit = false;
    this.limit = 10;

    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(acls => {
      if (acls instanceof CustomServerError) return;

      this.filteredAcls = acls.filter(acl => acl.role.id === this.role.id);

      const unassigned = acls.filter(acl => firstIndexOf(this.filteredAcls, (e) => e.user.id === acl.user.id) === -1);

      this.columnParams[2] = this.columnParams[2]
        .setAssigningFunction((e: Acl, value) => e.user = value)
        .setInputType(ColumnParamsInputType.AUTOCOMPLETE)
        .setAutocompleteOptions(unassigned.map(a => a.user))
        .setAutocompleteMapper(user => user.name)
        .setAutocompleteInitialValue(acl => acl.user)
    });

    this.init();
  }

  deleteEntityLocal(entity: Acl) {
    super.deleteEntityLocal(entity);

    this.filteredAcls = this.entitiesHolder.filter(acl => acl.role.id === this.role.id);
    const unassigned = this.entitiesHolder.filter(acl => firstIndexOf(this.filteredAcls, (e) => e.user.id === acl.user.id) === -1);

    this.columnParams[1] = this.columnParams[1]
      .setAutocompleteOptions(unassigned.map(a => a.user))
  }

  updateEntityLocal(entity: Acl) {
    super.updateEntityLocal(entity);

    this.filteredAcls = this.entitiesHolder.filter(acl => acl.role.id === this.role.id);
    const unassigned = this.entitiesHolder.filter(acl => firstIndexOf(this.filteredAcls, (e) => e.user.id === acl.user.id) === -1);

    this.columnParams[1] = this.columnParams[1]
      .setAutocompleteOptions(unassigned.map(a => a.user))
  }

  ngOnDestroy() {
    this.destroy();
  }

  addAcl(acl: Acl) {
    const index = firstIndexOf(this.entitiesHolder, (e) => e.user.id === acl.user.id);

    if (index === -1) return;

    const aclToUpdate = this.entitiesHolder[index];

    const dialogRef = this.deleteDialog.open(YesNoDialogComponent);
    dialogRef.componentInstance.text = `Confirm User Role`;
    dialogRef.componentInstance.secondaryText = `Adding ${aclToUpdate.user.name} to ${this.role.name} role will remove him from ${aclToUpdate.role.name} role.`;
    dialogRef.componentInstance.noText = `CANCEL`;
    dialogRef.componentInstance.yesText = `CONFIRM`;

    dialogRef.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      this.deleteDialogRef = null;

      if (result && result.success) {
        this.updateAcl(aclToUpdate);
      }
    });

  }

  updateAcl(acl: Acl) {
    const aclCopy = acl.copy();
    aclCopy.role = this.role.copy();

    this.service.updateEntity(aclCopy);
  }

}
