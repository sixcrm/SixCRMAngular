import { Component, OnInit } from '@angular/core';
import {SessionsService} from "../../shared/services/sessions.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Session} from '../../shared/models/session.model';

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends AbstractEntityIndexComponent<Session> implements OnInit {

  private sessions: Session[] = [];

  constructor(private sessionsService: SessionsService, router: Router, route: ActivatedRoute) {
    super(sessionsService, router, route);
  }

  ngOnInit() {
    this.sessionsService.entities$.subscribe((data) => this.sessions = data);
    this.sessionsService.getEntities();
  }

}
