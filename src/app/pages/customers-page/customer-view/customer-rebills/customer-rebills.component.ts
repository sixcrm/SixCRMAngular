import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {rebillsByCustomer, rebillsListQuery} from '../../../../shared/utils/queries/entities/rebill.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'customer-rebills',
  templateUrl: './customer-rebills.component.html',
  styleUrls: ['./customer-rebills.component.scss']
})
export class CustomerRebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() homepageMode: boolean = false;

  @Output() editRebill: EventEmitter<Rebill> = new EventEmitter();

  constructor(
    rebillsService: RebillsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService
  ) {
    super(rebillsService, auth, dialog, paginationService);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_REBILL_BILLED',(e: Rebill) => e.billAt ? e.billAt.tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('CUSTOMER_REBILL_AMOUNT', (e: Rebill) => e.amount.usd(), 'right').setNumberOption(true)
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => rebillsByCustomer(this.id, params);

    this.init(!!this.id);
  }

  ngOnDestroy() {
    this.service.indexQuery = rebillsListQuery;
    this.destroy();
  }

  updateRebill(rebill: Rebill) {
    this.editRebill.next(rebill);
  }
}
