import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {UsersService} from '../../../shared/services/users.service';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service'
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Acl} from '../../../shared/models/acl.model';
import {AccountsService} from '../../../shared/services/accounts.service';
import {RolesService} from '../../../shared/services/roles.service';
import {Role} from '../../../shared/models/role.model';
import {Account} from '../../../shared/models/account.model';
import {AclsService} from '../../../shared/services/acls.service';

@Component({
  selector: 'c-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbstractEntityIndexComponent<User> implements OnInit, OnDestroy {

  accounts: Account[] = [];
  roles: Role[] = [];
  ownerRole: Role;

  constructor(
    usersService: UsersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    private accountsService: AccountsService,
    private rolesService: RolesService,
    private aclService: AclsService
  ) {
    super(usersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new User();
    this.viewAfterCrate = false;

    this.columnParams = [
      new ColumnParams('Name', (e: User) => e.name),
      new ColumnParams('Email',(e: User) => e.email),
      new ColumnParams('Active', (e: User) => e.active + ''),
      new ColumnParams('Terms and Conditions', (e: User) => e.termsAndConditions)
    ];
  }

  ngOnInit() {
    this.init();

    this.accountsService.entities$.takeUntil(this.unsubscribe$).subscribe(accounts => {
      if (accounts instanceof CustomServerError) return;

      this.accounts = accounts;
    });

    this.rolesService.entities$.takeUntil(this.unsubscribe$).subscribe(roles => {
      if (roles instanceof CustomServerError) return;

      this.roles = roles.filter(role => role.name !== 'Owner');
      this.ownerRole = roles.filter(role => role.name === 'Owner')[0];
    });

    this.accountsService.getEntities();
    this.rolesService.getEntities();
  }

  ngOnDestroy() {
    this.destroy();
  }

  saveUser(response) {
    const user = response.user;
    const account = response.accountToAdd;
    const role = response.roleToAdd;

    this.entity.id = user.email;
    this.entity.auth0Id = user.email;

    this.accountsService.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(account => {
      if (account instanceof CustomServerError) return;

      const acl: Acl = new Acl();

      acl.account = account;
      acl.role = this.ownerRole;
      acl.user = user;

      this.aclService.createEntity(acl);
    });

    this.aclService.entityCreated$.takeUntil(this.unsubscribe$).subscribe(() => {
      this.viewEntity(this.entity.id);
    });

    this.service.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(user => {
      if (user instanceof CustomServerError) return;

      if (!account || !role) {
        const newAccount: Account = new Account();
        newAccount.active = 'true';
        newAccount.name = this.entity.name + ' Account';

        this.accountsService.createEntity(newAccount);
      } else {
        const acl: Acl = new Acl();
        acl.account = account;
        acl.role = role;
        acl.user = user;

        this.aclService.createEntity(acl);
      }
    });

    this.createEntity(this.entity);
  }
}
