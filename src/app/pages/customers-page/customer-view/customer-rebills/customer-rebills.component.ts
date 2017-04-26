import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
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

  constructor(
    rebillsService: RebillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(rebillsService, auth, dialog, progressBarService, paginationService);

    this.columnParams = [
      new ColumnParams('ID', (e: Rebill) => e.id),
      new ColumnParams('Bill At',(e: Rebill) => e.billAt ? e.billAt.format() : 'not billed'),
      new ColumnParams('Created At', (e: Rebill) => e.createdAt.format()),
      new ColumnParams('Amount', (e: Rebill) => e.amount)
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

}
