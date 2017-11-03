import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Account} from '../../../shared/models/account.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsService} from '../../../shared/services/accounts.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {Acl} from '../../../shared/models/acl.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions, CustomMenuOption} from '../../components/table-memory/table-memory.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import {AddUserAclDialogComponent} from '../../add-user-acl-dialog.component';
import {Role} from '../../../shared/models/role.model';
import {AclsService} from '../../../shared/services/acls.service';
import {RolesService} from '../../../shared/services/roles.service';
import {UsersService} from '../../../shared/services/users.service';
import {User} from '../../../shared/models/user.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {MessageDialogComponent} from '../../message-dialog.component';
import {InviteUserDialogComponent} from '../../invite-user-dialog.component';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AccountViewComponent extends AbstractEntityViewComponent<Account> implements OnInit, OnDestroy {

  text: TableMemoryTextOptions = {
    title: 'Associated Users',
    disassociateOptionText: `Remove User from Account`,
    associateOptionText: 'Add User to Account',
    viewOptionText: 'View User',
    disassociateModalTitle: 'Are you sure you want to remove user',
    editOptionText: 'Edit User Role'
  };

  formInvalid: boolean;
  aclMapper = (acl: Acl) => `${acl.user.name}`;

  aclColumnParams = [
    new ColumnParams('User', (e: Acl) => e.user.name),
    new ColumnParams('Role', (e: Acl) => e.role.name)
  ];

  addAclDialogRef: MdDialogRef<AddUserAclDialogComponent>;
  roles: Role[] = [];
  users: User[] = [];

  isOwner = (acl: Acl) => acl.role.name === 'Owner';

  selectedIndex: number = 0;

  constructor(service: AccountsService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              private router: Router,
              private dialog: MdDialog,
              private userService: UsersService,
              private aclService: AclsService,
              private roleService: RolesService,
              public authService: AuthenticationService
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    this.userService.entities$.takeUntil(this.unsubscribe$).subscribe(users => {
      if (users instanceof CustomServerError) return;

      const existingUsersIds = this.entity.acls.map(acl => acl.user.id);
      this.users = users.filter(user => existingUsersIds.indexOf(user.id) === -1);
    });

    this.roleService.entities$.takeUntil(this.unsubscribe$).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles.filter(role => role.name !== 'Owner');
    });

    this.service.entity$.takeUntil(this.unsubscribe$).subscribe(() => {
      this.userService.getEntities();
      this.roleService.getEntities();
    });

    if (this.addMode) {
      this.entity = new Account();
      this.entity.active = 'true';
      this.entityBackup = this.entity.copy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  saveAccount(valid: boolean) {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.service.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(account => {
      if (account instanceof CustomServerError) return;

      this.router.navigate(['/accounts', account.id]);
      this.userService.getEntities();
      this.roleService.getEntities();
    });

    this.saveOrUpdate(this.entity);
  }

  navigateToUser(acl: Acl) {
    this.router.navigate(['/users', acl.user.id])
  }

  removeAcl(acl: Acl) {
    if (this.isOwner(acl)) {
      this.showMessageDialog('You can not delete Owner user');
      return;
    }

    this.aclService.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
      this.service.getEntity(this.entity.id);
    });

    this.aclService.deleteEntity(acl.id);
  }

  showAddAclModal() {
    this.addAclDialogRef = this.dialog.open(AddUserAclDialogComponent);
    this.addAclDialogRef.componentInstance.roles = this.roles;
    this.addAclDialogRef.componentInstance.accountView = true;
    this.addAclDialogRef.componentInstance.users = this.users;

    this.addAclDialogRef.afterClosed().take(1).subscribe(result => {
      this.addAclDialogRef = null;
      if (result && result.user && result.user.id && result.role && result.role.id) {
        this.addAcl(result.user, result.role);
      }
    });
  }

  showEditAclModal(acl: Acl) {
    if (this.isOwner(acl)) {
      this.showMessageDialog('You can not edit Owner user');
      return;
    }

    this.addAclDialogRef = this.dialog.open(AddUserAclDialogComponent);
    this.addAclDialogRef.componentInstance.text = 'Edit User Acl';
    this.addAclDialogRef.componentInstance.roles = this.roles;
    this.addAclDialogRef.componentInstance.role = acl.role;
    this.addAclDialogRef.componentInstance.user = acl.user;
    this.addAclDialogRef.componentInstance.accountView = true;
    this.addAclDialogRef.componentInstance.editMode = true;

    this.addAclDialogRef.afterClosed().take(1).subscribe(result => {
      this.addAclDialogRef = null;
      if (result && result.role && result.role.id) {
        acl.role = result.role;
        this.updateAcl(acl);
      }
    });
  }

  addAcl(user: User, role: Role) {
    this.aclService.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
      this.service.getEntity(this.entity.id);
    });

    const acl = new Acl();
    acl.account = this.entity;
    acl.user = user;
    acl.role = role;
    this.aclService.createEntity(acl);
  }

  updateAcl(acl: Acl) {
    this.aclService.entityUpdated$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
      this.service.getEntity(this.entity.id);
    });

    this.aclService.updateEntity(acl);
  }

  showMessageDialog(text: string) {
    let messageDialogRef = this.dialog.open(MessageDialogComponent);
    messageDialogRef.componentInstance.text = text;

    messageDialogRef.afterClosed().take(1).subscribe(() => {
      messageDialogRef = null;
    });
  }

  inviteUser(): void {
    let inviteDialogRef = this.dialog.open(InviteUserDialogComponent);
    inviteDialogRef.componentInstance.options = this.roles.filter(role => role.name !== 'Owner');

    inviteDialogRef.afterClosed().take(1).subscribe(result => {
      inviteDialogRef = null;

      if (result.email && result.role) {
        this.userService.sendUserInvite(result.email, result.role, this.entityId).subscribe();
      }
    });
  }

  isOwnerOrAdministrator(): boolean {
    return this.authService.getActiveAcl()
      && this.authService.getActiveAcl().account.id === this.entityId
      && (this.authService.getActiveAcl().role.name === 'Owner' || this.authService.getActiveAcl().role.name === 'Administrator');
  }
}
