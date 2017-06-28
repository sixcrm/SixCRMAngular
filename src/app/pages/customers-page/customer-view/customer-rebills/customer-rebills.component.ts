import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {rebillsListQuery, rebillsByCustomer} from '../../../../shared/utils/query-builder';
import {ColumnParams} from '../../../../shared/models/column-params.model';

@Component({
  selector: 'customer-rebills',
  templateUrl: './customer-rebills.component.html',
  styleUrls: ['./customer-rebills.component.scss']
})
export class CustomerRebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() homepageMode: boolean = false;

  @Output() editRebill: EventEmitter<Rebill> = new EventEmitter();

  filterValue: string;

  constructor(
    rebillsService: RebillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService
  ) {
    super(rebillsService, auth, dialog, paginationService);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Customer', (e: Rebill) => e.parentSession.customer.firstName + ' ' + e.parentSession.customer.lastName),
      new ColumnParams('Bill At',(e: Rebill) => e.billAt ? e.billAt.tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('Amount', (e: Rebill) => e.amount.usd(), 'right')
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => rebillsByCustomer(this.id, limit, cursor);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = rebillsListQuery;
    this.destroy();
  }

  updateRebill(rebill: Rebill) {
    this.editRebill.next(rebill);
  }
}
