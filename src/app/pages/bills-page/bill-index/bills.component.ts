import {Component, OnInit, OnDestroy} from '@angular/core';
import {Bill} from '../../../shared/models/bill.model';
import {BillsService} from '../../../shared/services/bills.service';
import {MdDialog} from '@angular/material';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {ColumnParams} from '../../../shared/models/column-params.model';

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
    activatedRoute: ActivatedRoute
  ) {
    super(billsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Bill();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('BILL_INDEX_HEADER_ID', (e: Bill) => e.id).setSelected(false),
      new ColumnParams('BILL_INDEX_HEADER_ACCOUNT', (e: Bill) => e.account.name).setSelected(false),
      new ColumnParams('BILL_INDEX_HEADER_START', (e: Bill) => e.periodStart.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('BILL_INDEX_HEADER_END', (e: Bill) => e.periodEnd.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('BILL_INDEX_HEADER_AVALIABLE', (e: Bill) => e.availableAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('BILL_INDEX_HEADER_OVERDUE', (e: Bill) => !!e.outstanding + ''),
      new ColumnParams('BILL_INDEX_HEADER_PAID', (e: Bill) => !!e.paid + '').setSelected(false),
      new ColumnParams('BILL_INDEX_HEADER_BALANCE', (e: Bill) => e.endingBalance.usd(), 'right').setNumberOption(true),
      new ColumnParams('BILL_INDEX_HEADER_CREATED', (e: Bill) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('BILL_INDEX_HEADER_UPDATED', (e: Bill) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
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
