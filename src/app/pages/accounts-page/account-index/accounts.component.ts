import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {AccountsService} from '../../../shared/services/accounts.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Account} from '../../../shared/models/account.model';
import {Acl} from '../../../shared/models/acl.model';

@Component({
  selector: 'accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent extends AbstractEntityIndexComponent<Account> implements OnInit, OnDestroy {

  actAsOptionText: string;

  constructor(
    affiliatesService: AccountsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(affiliatesService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Account();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('ACCOUNT_INDEX_HEADER_NAME', (e: Account) => e.name),
      new ColumnParams('ACCOUNT_INDEX_HEADER_ACTIVE', (e: Account) => e.active + ''),
      new ColumnParams('ACCOUNT_INDEX_HEADER_CREATED', (e: Account) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('ACCOUNT_INDEX_HEADER_UPDATED', (e: Account) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];

    this.authService.activeAcl$.takeUntil(this.unsubscribe$).subscribe((acl: Acl) => {
      const isMasterAcc = acl.account.id === '*';
      this.actAsOptionText = isMasterAcc ? 'act as this account' : null;
    });

    this.authService.actingAsAccount$.skip(1).takeUntil(this.unsubscribe$).subscribe(() => {
      this.resetEntities();
      this.refreshData();
    })
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  actAs(account: Account) {
    this.authService.startActingAs(account);
  }

}
