import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {CustomerSessionsComponent} from '../../../customers-page/customer-view/customer-sessions/customer-sessions.component';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {SessionsService} from '../../../../entity-services/services/sessions.service';
import {utc} from 'moment';
import {Session} from '../../../../shared/models/session.model';

@Component({
  selector: 'customer-service-sessions',
  templateUrl: './customer-service-sessions.component.html',
  styleUrls: ['./customer-service-sessions.component.scss']
})
export class CustomerServiceSessionsComponent extends CustomerSessionsComponent implements OnInit, OnDestroy {

  utcf = utc;

  @Output() sessionClicked: EventEmitter<Session> = new EventEmitter();

  constructor(
    transactionsService: SessionsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService
  ) {
    super(transactionsService, auth, dialog, paginationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
