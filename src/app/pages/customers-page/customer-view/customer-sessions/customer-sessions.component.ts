import { Component, OnInit, Input } from '@angular/core';
import {SessionsService} from '../../../../shared/services/sessions.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {sessionsInfoListQuery, sessionsByCustomer} from '../../../../shared/utils/query-builder';
import {Session} from '../../../../shared/models/session.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';

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
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(transactionsService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => sessionsByCustomer(this.id, limit, cursor);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = sessionsInfoListQuery;
    this.destroy();
  }

}
