import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Account} from '../../../shared/models/account.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsService} from '../../../shared/services/accounts.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {Acl} from '../../../shared/models/acl.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {
  TableMemoryTextOptions, CustomMenuOption,
  CustomMenuOptionResult
} from '../../components/table-memory/table-memory.component';
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
import {SnackbarService} from '../../../shared/services/snackbar.service';
import {BillsService} from '../../../shared/services/bills.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AccountViewComponent extends AbstractEntityViewComponent<Account> implements OnInit, OnDestroy {

  text: TableMemoryTextOptions = {
    title: 'ACCOUNT_USERS_TITLE',
    disassociateOptionText: 'ACCOUNT_USERS_REMOVE',
    associateOptionText: 'ACCOUNT_USERS_ADD',
    viewOptionText: 'ACCOUNT_USERS_VIEW',
    disassociateModalTitle: 'ACCOUNT_USERS_REMOVEMESSAGE',
    editOptionText: 'ACCOUNT_USERS_EDIT'
  };

  menuOptions: CustomMenuOption[] = [
    {label: 'ACCOUNT_USERS_VIEW', option: 'view', show: (acl: Acl) => !acl.pending && this.authService.isActiveAclMasterAccount()},
    {label: 'ACCOUNT_USERS_INVITE', option: 'resend', show: (acl: Acl) => !!acl.pending}
  ];

  formInvalid: boolean;
  aclMapper = (acl: Acl) => `${acl.user.name}`;

  aclColumnParams = [
    new ColumnParams('ACCOUNT_USERS_HEADER_NAME', (e: Acl) => e.user.name),
    new ColumnParams('ACCOUNT_USERS_HEADER_ROLE', (e: Acl) => e.role.name),
    new ColumnParams('ACCOUNT_USERS_HEADER_STATUS', (e: Acl) => e.pending || 'Active')
  ];

  addAclDialogRef: MdDialogRef<AddUserAclDialogComponent>;
  roles: Role[] = [];
  users: User[] = [];

  isOwner = (acl: Acl) => acl.role.name === 'Owner';

  selectedIndex: number = 0;
  isBillingFocused: boolean;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'ACCOUNT_TAB_GENERAL'},
    {name: 'users', label: 'ACCOUNT_TAB_USERS'},
    {name: 'accesskeys', label: 'ACCOUNT_TAB_KEYS'}
  ];

  constructor(service: AccountsService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              private router: Router,
              private dialog: MdDialog,
              private userService: UsersService,
              private aclService: AclsService,
              private roleService: RolesService,
              private snackbarService: SnackbarService,
              public authService: AuthenticationService,
              private billsService: BillsService
  ) {
    super(service, route);
  }

  ngOnInit() {
    if (this.showBilling()) {
      this.tabHeaders.push(
        {name: 'billing', label: 'ACCOUNT_TAB_BILLING'}
      )
    }

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
      if (this.authService.isActiveAclMasterAccount() || this.isOwnerOrAdministrator()) {
        this.roleService.getEntities();
      }

      if (this.authService.isActiveAclMasterAccount()) {
        this.userService.getEntities();
      }
    });

    if (this.addMode) {
      this.entity = new Account();
      this.entity.active = true;
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
    if (acl.pending || !this.authService.isActiveAclMasterAccount()) return;

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
        this.userService.sendUserInvite(result.email, result.role, this.entityId).subscribe(() => {
          this.service.getEntity(this.entityId);
        });
      }
    });
  }

  resendInvite(acl: Acl): void {
    this.userService.resendUserInvite(acl).subscribe(() => {
      this.snackbarService.showSuccessSnack('Invitation Successfully Resent!', 3000);
    });
  }

  isOwnerOrAdministrator(): boolean {
    return !!this.authService.getActingAsAccount()
      || (this.authService.getActiveAcl()
      && this.authService.getActiveAcl().account.id === this.entityId
      && (this.authService.getActiveAcl().role.name === 'Owner' || this.authService.getActiveAcl().role.name === 'Administrator'));
  }

  menuItemSelected(result: CustomMenuOptionResult): void {

    if (result.option === 'view') {
      this.navigateToUser(result.entity);
    }

    if (result.option === 'resend') {
      this.resendInvite(result.entity)
    }
  }

  showBilling(): boolean {
    const acl = this.authService.getActiveAcl();

    return this.authService.isActiveOrActingAclMasterAccount() || (acl && acl.account.id === this.entityId && this.billsService.hasReadPermission());
  }

  setIndex(index: number) {
    this.selectedIndex = index;

    if (this.selectedIndex === 3) {
      setTimeout(() => {this.isBillingFocused = true}, 300)
    }
  }

  startActingAs() {
    this.authService.startActingAs(this.entity);

    this.authService.actingAsAccount$.takeUntil(this.unsubscribe$).skip(1).take(1).subscribe(() => {
      this.router.navigate(['/accounts']);
    })
  }
}
