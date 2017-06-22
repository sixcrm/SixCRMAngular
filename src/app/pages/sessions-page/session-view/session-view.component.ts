import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../shared/services/sessions.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent extends AbstractEntityViewComponent<Session> implements OnInit, OnDestroy {

  constructor(service: SessionsService, route: ActivatedRoute, progressBarService: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    super.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
