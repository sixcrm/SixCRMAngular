import { Component, OnInit, Input } from '@angular/core';
import {SessionsService} from '../../../../shared/services/sessions.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Session} from '../../../../shared/models/session.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {sessionsByCustomer, sessionsInfoListQuery} from '../../../../shared/utils/queries/entities/session.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog} from '@angular/material';

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
    dialog: MatDialog,
    paginationService: PaginationService
  ) {
    super(transactionsService, auth, dialog, paginationService);

    this.columnParams = [
      new ColumnParams('CUSTOMER_SESSION_NAME', (e: Session) => `${e.customer.firstName} ${e.customer.lastName}`),
      new ColumnParams('CUSTOMER_SESSION_CAMPAIGN',(e: Session) => e.campaign.name),
      new ColumnParams('CUSTOMER_SESSION_PRODUCTSCHEDULENUM', (e: Session) => e.productSchedules.length.toString(), 'right'),
      new ColumnParams('CUSTOMER_SESSION_REBILLNUM', (e: Session) => e.rebills.length.toString(), 'right')
    ];
  }

  refreshData() {
    this.loadingData = true;
    this.serverError = null;
    this.service.getEntities(this.limit);
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => sessionsByCustomer(this.id, params);

    this.init(!!this.id);
  }

  ngOnDestroy() {
    this.service.indexQuery = sessionsInfoListQuery;
    this.destroy();
  }

}
