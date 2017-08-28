import { Component, OnInit, Input } from '@angular/core';
import {SessionsService} from '../../../../shared/services/sessions.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Session} from '../../../../shared/models/session.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {sessionsByCustomer, sessionsInfoListQuery} from '../../../../shared/utils/queries/entities/session.queries';

@Component({
  selector: 'customer-sessions',
  templateUrl: './customer-sessions.component.html',
  styleUrls: ['./customer-sessions.component.scss']
})
export class CustomerSessionsComponent extends AbstractEntityIndexComponent<Session> implements OnInit {

  @Input() id: string;

  constructor(
    transactionsService: SessionsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService
  ) {
    super(transactionsService, auth, dialog, paginationService);

    this.columnParams = [
      new ColumnParams('Customer Name', (e: Session) => `${e.customer.firstName} ${e.customer.lastName}`),
      new ColumnParams('Campaign Name',(e: Session) => e.campaign.name),
      new ColumnParams('Number of Product Schedules', (e: Session) => e.productSchedules.length.toString(), 'right'),
      new ColumnParams('Number of Rebills', (e: Session) => e.rebills.length.toString(), 'right')
    ];
  }

  refreshData() {
    this.loadingData = true;
    this.serverError = null;
    this.service.getEntities(this.limit);
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => sessionsByCustomer(this.id, limit, cursor);

    this.init(!!this.id);
  }

  ngOnDestroy() {
    this.service.indexQuery = sessionsInfoListQuery;
    this.destroy();
  }

}
