import { Component, OnInit } from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Router, ActivatedRoute} from '@angular/router';
import {Email} from '../../shared/models/email.model';
import {EmailsService} from '../../shared/services/emails.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'c-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent extends AbstractEntityIndexComponent<Email> implements OnInit {

  constructor(
    private emailsService: EmailsService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(emailsService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.emailsService.entityDeleted$.subscribe((data) => this.emailsService.getEntities());

    this.init();
  }

}
