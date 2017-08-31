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

  accountsMapFunction = (account: Account) => account.name;
  rolesMapFunction = (role: Role) => role.name;
  aclMapper = (acl: Acl) => `${acl.account.name}`;

  aclColumnParams = [
    new ColumnParams('Account', (e: Acl) => e.account.name),
    new ColumnParams('Role', (e: Acl) => e.role.name)
  ];

  addAclDialogRef: MdDialogRef<AddUserAclDialogComponent>;

  constructor(service: UsersService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              private accountsService: AccountsService,
              private rolesService: RolesService,
              private aclService: AclsService,
              private router: Router,
              private dialog: MdDialog
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    this.accountsService.entities$.takeUntil(this.unsubscribe$).subscribe(accounts => {
      if (accounts instanceof CustomServerError) return;

      this.accounts = accounts.filter(acc => acc.name !== 'Master Account');
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

  saveUser(valid: boolean) {
    this.formInvalid = !valid || (!this.newAccount && !this.roleToAdd.id && !this.accountToAdd.id);

    if (this.formInvalid) return;

    if (this.addMode) {
      this.entity.id = this.entity.email;
      this.entity.auth0Id = this.entity.email;

      this.aclService.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
        this.router.navigate(['/users', this.entity.id]);
        this.service.getEntity(this.entity.id);
      });

      this.accountsService.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(account => {
        if (account instanceof CustomServerError) return;

        const acl: Acl = new Acl();

        acl.account = account;
        acl.role = this.ownerRole;
        acl.user = this.entity;

        this.aclService.createEntity(acl);
      });

      this.service.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(user => {
        if (user instanceof CustomServerError) return;

        if (this.newAccount) {
          const account: Account = new Account();
          account.active = 'true';
          account.name = this.entity.name + ' Account';

          this.accountsService.createEntity(account);
        } else {
          const acl: Acl = new Acl();
          acl.account = this.accountToAdd;
          acl.role = this.roleToAdd;
          acl.user = user;

          this.aclService.createEntity(acl);
        }
      });

      this.saveEntity(this.entity);
    } else {
      this.updateEntity(this.entity);
    }
  }

  removeAcl(acl: Acl) {
    this.aclService.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
      this.service.getEntity(this.entity.id);
    });

    this.aclService.deleteEntity(acl.id);
  }

  showAddAclModal() {
    this.addAclDialogRef = this.dialog.open(AddUserAclDialogComponent);
    this.addAclDialogRef.componentInstance.roles = this.roles;
    this.addAclDialogRef.componentInstance.accounts = this.accounts;

    this.addAclDialogRef.afterClosed().take(1).subscribe(result => {
      this.addAclDialogRef = null;

      if (result.account && result.account.id && result.role && result.role.id) {
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

}
