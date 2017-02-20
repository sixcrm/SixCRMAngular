import {Component, OnInit, OnDestroy} from '@angular/core';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../shared/services/sessions.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent extends AbstractEntityViewComponent<Session> implements OnInit, OnDestroy {

  constructor(
    private sessionsService: SessionsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(sessionsService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new Session();
    }

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
