import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../shared/services/users.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {Account} from '../../../shared/models/account.model';
import {Role} from '../../../shared/models/role.model';
import {AccountsService} from '../../../shared/services/accounts.service';
import {RolesService} from '../../../shared/services/roles.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Acl} from '../../../shared/models/acl.model';
import {AclsService} from '../../../shared/services/acls.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MdDialogRef, MdDialog} from '@angular/material';
import {AddUserAclDialogComponent} from '../../add-user-acl-dialog.component';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {MessageDialogComponent} from '../../message-dialog.component';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends AbstractEntityViewComponent<User> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

  newAccount: boolean = true;
  accountToAdd: Account = new Account();
  roleToAdd: Role = new Role();

  ownerRole: Role;

  accounts: Account[] = [];
  roles: Role[] = [];

  text: TableMemoryTextOptions = {
    title: 'Associated Accounts',
    disassociateOptionText: `Remove Account from User`,
    associateOptionText: 'Add Account to User',
    viewOptionText: 'View Account',
    disassociateModalTitle: 'Are you sure you want to remove account',
    editOptionText: 'Edit User Role'
  };

  aclMapper = (acl: Acl) => `${acl.account.name}`;

  aclColumnParams = [
    new ColumnParams('Account', (e: Acl) => e.account.name),
    new ColumnParams('Role', (e: Acl) => e.role.name)
  ];

  addAclDialogRef: MdDialogRef<AddUserAclDialogComponent>;

  isOwner = (acl: Acl) => acl.role.name === 'Owner';

  constructor(service: UsersService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              public authService: AuthenticationService,
              private accountsService: AccountsService,
              private rolesService: RolesService,
              public aclService: AclsService,
              private router: Router,
              private dialog: MdDialog
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    this.accountsService.entities$.takeUntil(this.unsubscribe$).subscribe(accounts => {
      if (accounts instanceof CustomServerError) return;

      this.accounts = accounts;
    });

    this.rolesService.entities$.takeUntil(this.unsubscribe$).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles.filter(role => role.name !== 'Owner');
      this.ownerRole = roles.filter(role => role.name === 'Owner')[0];
    });

    if (this.addMode) {
      this.entity = new User();
      this.entity.active = 'true';
      this.entity.termsAndConditions = '0.1';
      this.entityBackup = this.entity.copy();
    }

    this.accountsService.getEntities();
    this.rolesService.getEntities();
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  removeAcl(acl: Acl) {
    if (this.isOwner(acl)) {
      this.showMessageDialog('You can not delete Owner user from Account');
      return;
    }

    this.aclService.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
      this.service.getEntity(this.entity.id);
    });

    this.aclService.deleteEntity(acl.id);
  }

  navigateToAccount(acl: Acl) {
    this.router.navigate(['/accounts', acl.account.id])
  }

  showAddAclModal() {
    this.addAclDialogRef = this.dialog.open(AddUserAclDialogComponent);
    this.addAclDialogRef.componentInstance.accounts = this.accounts;
    this.addAclDialogRef.componentInstance.roles = this.roles;

    this.addAclDialogRef.afterClosed().take(1).subscribe(result => {
      this.addAclDialogRef = null;
      if (result && result.account && result.account.id && result.role && result.role.id) {
        this.addAcl(result.account, result.role);
      }
    });
  }

  addAcl(account: Account, role: Role) {
    this.aclService.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
      this.service.getEntity(this.entity.id);
    });

    const acl = new Acl();
    acl.user = this.entity;
    acl.account = account;
    acl.role = role;
    this.aclService.createEntity(acl);
  }


  showEditAclModal(acl: Acl) {
    if (this.isOwner(acl)) {
      this.showMessageDialog('You can not edit Owner user');
      return;
    }

    this.addAclDialogRef = this.dialog.open(AddUserAclDialogComponent);
    this.addAclDialogRef.componentInstance.text = 'Edit User Acl';
    this.addAclDialogRef.componentInstance.account = acl.account;
    this.addAclDialogRef.componentInstance.role = acl.role;
    this.addAclDialogRef.componentInstance.roles = this.roles;
    this.addAclDialogRef.componentInstance.editMode = true;

    this.addAclDialogRef.afterClosed().take(1).subscribe(result => {
      this.addAclDialogRef = null;
      if (result && result.role && result.role.id) {
        acl.role = result.role;
        this.updateAcl(acl);
      }
    });
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

  canBeDeactivated() {
    this.entity.id = this.entity.email;

    return super.canBeDeactivated();
  }
}
