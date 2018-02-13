import {Component, OnInit, OnDestroy} from '@angular/core';
import {Bill} from '../../../shared/models/bill.model';
import {BillsService} from '../../../shared/services/bills.service';
import {MdDialog} from '@angular/material';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {UserSettingsService} from '../../../shared/services/user-settings.service';

@Component({
  selector: 'bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent extends AbstractEntityIndexComponent<Bill> implements OnInit, OnDestroy {

  constructor(
    billsService: BillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    userSettingsService: UserSettingsService
  ) {
    super(billsService, auth, dialog, paginationService, router, activatedRoute, userSettingsService);

    this.entityFactory = () => new Bill();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('BILL_INDEX_HEADER_START', (e: Bill) => e.periodStart.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('BILL_INDEX_HEADER_END', (e: Bill) => e.periodEnd.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('BILL_INDEX_HEADER_OVERDUE', (e: Bill) => !!e.outstanding + ''),
      new ColumnParams('BILL_INDEX_HEADER_BALANCE', (e: Bill) => e.endingBalance.usd(), 'right').setNumberOption(true)
    ];

  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  closeAddMode(): void{
    this.addMode = false;
  }
}
