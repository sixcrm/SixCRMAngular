import { Component, OnInit } from '@angular/core';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../shared/services/sessions.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent implements OnInit {

  private session: Session;

  constructor(private sessionsService: SessionsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sessionsService.session$.subscribe((session: Session) => this.session = session);
    this.route.params.subscribe((params: Params) => {
      this.sessionsService.getSession(params['id']);
    });
  }

}
