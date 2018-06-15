import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../entity-services/services/rebills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {rebillListByState, rebillsListQuery} from '../../../../shared/utils/queries/entities/rebill.queries';
import {TableMemoryTextOptions} from '../../../components/table-memory/table-memory.component';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'state-machine-rebills',
  templateUrl: './state-machine-rebills.component.html',
  styleUrls: ['./state-machine-rebills.component.scss']
})
export class StateMachineRebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  queue: string;

  tableTextOptions: TableMemoryTextOptions = {
    viewOptionText: 'ORDERENGINE_REBILLS_VIEW',
    noDataText: 'ORDERENGINE_REBILLS_NODATA'
  };

  @Input() set queueName(value: string) {
    if (!value || value === this.queue) return;

    this.queue = value;

    this.reinit();
  }

  @Output() viewRebill: EventEmitter<Rebill> = new EventEmitter();

  constructor(
    service: RebillsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('ORDERENGINE_REBILLS_ID', (e: Rebill) => e.id),
      new ColumnParams('ORDERENGINE_REBILLS_BILLED',(e: Rebill) => e.billAt ? e.billAt.tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('ORDERENGINE_REBILLS_CREATED', (e: Rebill) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('ORDERENGINE_REBILLS_AMOUNT', (e: Rebill) => e.amount.usd(), 'right').setNumberOption(true)
    ];

    this.limit = 100;
  }

  reinit(): void {
    this.resetEntities();
    this.service.indexQuery = (params: IndexQueryParameters) => rebillListByState(this.queue, params.limit, this.entitiesHolder.length);
    this.refreshData();
  }

  ngOnInit() {
    this.init(false);
  }

  ngOnDestroy() {
    this.service.indexQuery = rebillsListQuery;

    this.destroy();
  }

}
