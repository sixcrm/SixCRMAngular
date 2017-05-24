import {Component, OnInit, OnDestroy} from '@angular/core';
import {SessionsService} from "../../shared/services/sessions.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Session} from '../../shared/models/session.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends AbstractEntityIndexComponent<Session> implements OnInit, OnDestroy {

  constructor(
    sessionsService: SessionsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(sessionsService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Customer Name', (e: Session) => e.customer.firstName + e.customer.lastName),
      new ColumnParams('Campaign Name',(e: Session) => e.campaign.name),
      new ColumnParams('Number of Product Schedules', (e: Session) => e.productSchedules.length.toString(), 'right'),
      new ColumnParams('Number of Rebills', (e: Session) => e.rebills.length.toString(), 'right')
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
