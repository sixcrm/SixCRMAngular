import { Component, OnInit } from '@angular/core';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../shared/services/sessions.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent extends AbstractEntityViewComponent<Session> implements OnInit {

  private session: Session;

  constructor(
    private sessionsService: SessionsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(sessionsService, route, progressBarService);
  }

  ngOnInit() {
    this.sessionsService.entity$.subscribe((session: Session) => {
      this.session = session;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }

}
