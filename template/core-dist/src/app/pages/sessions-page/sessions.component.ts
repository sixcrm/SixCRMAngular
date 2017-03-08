import { Component, OnInit } from '@angular/core';
import {SessionsService} from "../../shared/services/sessions.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Session} from '../../shared/models/session.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends AbstractEntityIndexComponent<Session> implements OnInit {

  constructor(
    private sessionsService: SessionsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(sessionsService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.sessionsService.entityDeleted$.subscribe((data) => this.sessionsService.getEntities());

    this.init();
  }

}
