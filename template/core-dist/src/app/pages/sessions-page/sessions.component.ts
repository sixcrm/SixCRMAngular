import { Component, OnInit } from '@angular/core';
import {SessionsService} from "../../shared/services/sessions.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Session} from '../../shared/models/session.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends AbstractEntityIndexComponent<Session> implements OnInit {

  constructor(
    private sessionsService: SessionsService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(sessionsService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.sessionsService.entityDeleted$.subscribe((data) => this.sessionsService.getEntities());

    this.init();
  }

}
