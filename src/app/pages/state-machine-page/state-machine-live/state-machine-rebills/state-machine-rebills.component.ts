import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {rebillListByState, rebillsListQuery} from '../../../../shared/utils/queries/entities/rebill.queries';
import {TableMemoryTextOptions} from '../../../components/table-memory/table-memory.component';

@Component({
  selector: 'state-machine-rebills',
  templateUrl: './state-machine-rebills.component.html',
  styleUrls: ['./state-machine-rebills.component.scss']
})
export class StateMachineRebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  queue: string;

  tableTextOptions: TableMemoryTextOptions = {viewOptionText: 'Show Messages'};

  @Input() set queueName(value: string) {
    if (!value || value === this.queue) return;

    this.queue = value;

    this.reinit();
  }

  @Output() viewRebill: EventEmitter<Rebill> = new EventEmitter();

  constructor(
    service: RebillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('ID', (e: Rebill) => e.id),
      new ColumnParams('Bill At',(e: Rebill) => e.billAt ? e.billAt.tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('Created At', (e: Rebill) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Amount', (e: Rebill) => e.amount.usd(), 'right')
    ];
  }

  reinit(): void {
    this.resetEntities();
    this.service.indexQuery = (limit, cursor) => rebillListByState(this.queue, limit, cursor);
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