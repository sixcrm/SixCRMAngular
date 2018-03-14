import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {EntityAclsService} from '../../../shared/services/entityacl.service';
import {EntityAcl, EntityAclPermissionParsed} from '../../../shared/models/entityacl.model';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {UsersService} from '../../../shared/services/users.service';
import {AccountsService} from '../../../shared/services/accounts.service';
import {User} from '../../../shared/models/user.model';
import {Account} from '../../../shared/models/account.model';
import {TableMemoryTextOptions} from '../table-memory/table-memory.component';
import {ColumnParams, ColumnParamsInputType} from '../../../shared/models/column-params.model';
import {getAllPermissionActions} from '../../../shared/models/permissions.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';

@Component({
  selector: 'entity-view-entityacl',
  templateUrl: './entity-view-entityacl.component.html',
  styleUrls: ['./entity-view-entityacl.component.scss']
})
export class EntityViewEntityaclComponent implements OnInit, OnDestroy {

  @Input() entityId: string;
  @Input() type: string;

  showModal: boolean;
  entityAcl: EntityAcl;
  private backupEntityAcl: EntityAcl;

  selectedVisibility: string;
  selectedIndex: number = 0;

  users: User[] = [];
  accounts: Account[] = [];

  allowedParams: ColumnParams<EntityAclPermissionParsed>[] = [];
  allowedTextOptions: TableMemoryTextOptions = {
    title: 'SINGLEPAGE_ENTITYACL_ADVANCEDTITLE',
    noDataText: 'SINGLEPAGE_ENTITYACL_NODATA',
    editOptionText: 'SINGLEPAGE_ENTITYACL_EDIT',
    disassociateOptionText: 'SINGLEPAGE_ENTITYACL_REMOVE'
  };

  permissionFactory = (data) => new EntityAclPermissionParsed(new Account(), new User(), '');

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private entityAclsService: EntityAclsService,
    private userService: UsersService,
    private accountService: AccountsService
  ) { }

  ngOnInit() {
    this.setAdvanceTableParameters();
    this.fetchEntityAcl();
    this.fetchUsers();
    this.fetchAccounts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  selectVisibility(value: string): void {
    this.selectedVisibility = value;
  }

  cancel(): void {
    this.entityAcl = this.backupEntityAcl.copy();
    this.selectedVisibility = this.entityAcl.entity ? 'Public' : 'Private';

    this.showModal = false;
  }

  saveAcl(): void {
    if (this.shouldCreateBasicEntityAcl()) {
      this.createBasicEntityAcl();
    } else if (this.shouldDeleteBasicEntityAcl()) {
      this.deleteEntityAcl();
    } else {
      this.showModal = false;
    }
  }

  addAllowed(permission: EntityAclPermissionParsed) {
    let actions: string[] = permission.action === getAllPermissionActions().join(' ') ? ['*'] : permission.action.split(' ');

    const newAllowed = actions.map(a => `${permission.account.id}/${permission.user.id}/${a}`);

    if (this.entityAcl.entity) {
      this.entityAcl.allow = [...this.entityAcl.allow, ...newAllowed];
      this.entityAclsService.updateEntity(this.entityAcl);
    } else {
      const newAcl = new EntityAcl({entity: this.entityId, type: this.type, allow: newAllowed});
      this.entityAclsService.createEntity(newAcl);
    }
  }

  updateAllowed(permission: EntityAclPermissionParsed) {
    const acl = this.entityAcl.allowParsed[permission['tableAdvancedIdentifier']];

    const delPerm = new EntityAclPermissionParsed(acl.account, acl.user, getAllPermissionActions().join(' '));

    this.deleteAllowed(delPerm, true);
    this.addAllowed(permission);
  }

  deleteAllowed(permission: EntityAclPermissionParsed, noUpdate?: boolean) {
    const perms = this.getParameterActions(permission);

    perms.forEach(p => {
      const index = firstIndexOf(this.entityAcl.allow, (el) => el === `${permission.account.id}/${permission.user.id}/${p}`);

      if (index !== -1) {
        this.entityAcl.allow.splice(index, 1);
      }
    });

    if (noUpdate) return;

    this.entityAclsService.updateEntity(this.entityAcl);
  }

  deleteManyAllowed(permissions: EntityAclPermissionParsed[]) {
    permissions.forEach(p => {
      this.deleteAllowed(p, true);
    });

    this.entityAclsService.updateEntity(this.entityAcl);
  }

  overlayClicked(event: any): void {
    if (event && event.target && event.target.className === 'acl-modal-container') {
      this.cancel();
    }
  }

  private fetchAccounts() {
    this.accountService.entities$.takeUntil(this.unsubscribe$).subscribe(accounts => {
      if (accounts instanceof CustomServerError) return;

      this.assignAccounts(accounts);
    });
    this.accountService.getEntities();
  }

  private assignAccounts(accounts) {
    this.accounts = [new Account({name: '*', id: '*'}), ...accounts];
    this.allowedParams[0].setAutocompleteOptions(this.accounts);
  }

  private fetchUsers() {
    this.userService.entities$.takeUntil(this.unsubscribe$).subscribe(users => {
      if (users instanceof CustomServerError) return;

      this.assignUsers(users);
    });
    this.userService.getEntities();
  }

  private assignUsers(users) {
    this.users = [new User({name: '*', id: '*'}), ...users];
    this.allowedParams[1].setAutocompleteOptions(this.users);
  }

  private fetchEntityAcl() {
    this.entityAclsService.entity$
      .merge(this.entityAclsService.entityCreated$)
      .merge(this.entityAclsService.entityUpdated$)
      .takeUntil(this.unsubscribe$)
      .subscribe(acl => {
        if (acl instanceof CustomServerError) return;

        this.assignEntityAcl(acl);
      });

    this.entityAclsService.getEntity(this.entityId);
  }

  private assignEntityAcl(acl) {
    this.entityAcl = acl;
    this.backupEntityAcl = this.entityAcl.copy();

    this.selectedVisibility = this.entityAcl.entity ? 'Public' : 'Private';
  }

  private setAdvanceTableParameters() {
    this.allowedParams = [
      new ColumnParams<EntityAclPermissionParsed>('SINGLEPAGE_ENTITYACL_ACCOUNT')
        .setMappingFunction((e: EntityAclPermissionParsed) => e.account.name === '*' ? 'All' : e.account.name)
        .setAssigningFunction((e: EntityAclPermissionParsed, value) => e.account = value)
        .setValidator((e: EntityAclPermissionParsed) => !!e.account.id)
        .setInputType(ColumnParamsInputType.AUTOCOMPLETE)
        .setAutocompleteOptions(this.accounts)
        .setAutofocus(true)
        .setAutocompleteMapper((e: Account) => e.name === '*' ? 'All' : e.name)
        .setAutocompleteInitialValue((e: EntityAclPermissionParsed) => e.account),
      new ColumnParams<EntityAclPermissionParsed>('SINGLEPAGE_ENTITYACL_USER')
        .setMappingFunction((e: EntityAclPermissionParsed) => e.user.name === '*' ? 'All' : e.user.name)
        .setAssigningFunction((e: EntityAclPermissionParsed, value) => e.user = value)
        .setValidator((e: EntityAclPermissionParsed) => !!e.user.id)
        .setInputType(ColumnParamsInputType.AUTOCOMPLETE)
        .setAutocompleteOptions(this.users)
        .setAutocompleteMapper((e: User) => e.name === '*' ? 'All' : e.name)
        .setAutocompleteInitialValue((e: EntityAclPermissionParsed) => e.user),
      new ColumnParams<EntityAclPermissionParsed>('SINGLEPAGE_ENTITYACL_ACTION')
        .setMappingFunction((e: EntityAclPermissionParsed) => e.action.replace(/(^|\s)\S/g, l => l.toUpperCase()))
        .setAssigningFunction((e: EntityAclPermissionParsed, value) => {
          e.action = value.map(v => v.value).join(' ');
          return e;
        })
        .setValidator((e: EntityAclPermissionParsed) => !!e.action)
        .setInputType(ColumnParamsInputType.MULTISELECT)
        .setAutocompleteOptions(getAllPermissionActions())
        .setAutocompleteInitialValue((e: EntityAclPermissionParsed) => e.action ? [e.action] : []),
    ];
  }

  private shouldDeleteBasicEntityAcl() {
    return this.selectedVisibility === 'Private' && this.entityAcl.entity;
  }

  private shouldCreateBasicEntityAcl() {
    return this.selectedVisibility === 'Public' && !this.entityAcl.entity;
  }

  private deleteEntityAcl() {
    this.entityAclsService.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(response => {
      if (response instanceof CustomServerError) return;

      this.onDeleteEntityAcl();
    });
    this.entityAclsService.deleteEntity(this.entityId);
  }

  private onDeleteEntityAcl() {
    this.entityAcl = new EntityAcl();
    this.backupEntityAcl = this.entityAcl.copy();

    this.selectedVisibility = 'Private';
  }

  private createBasicEntityAcl() {
    const acl = new EntityAcl({entity: this.entityId, type: this.type, allow: ['*/*/read']});
    this.entityAclsService.createEntity(acl);
  }

  private getParameterActions(permission: EntityAclPermissionParsed) {
    let perms = ['*', ...getAllPermissionActions()];
    if (permission.action !== getAllPermissionActions().join(' ')) {
      perms = permission.action.split(' ');
    }

    return perms;
  }
}
