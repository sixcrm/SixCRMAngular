import { Component, OnInit } from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Email} from '../../shared/models/email.model';
import {EmailsService} from '../../shared/services/emails.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'c-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent extends AbstractEntityIndexComponent<Email> implements OnInit {

  constructor(
    private emailsService: EmailsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(emailsService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.emailsService.entityDeleted$.subscribe((data) => this.emailsService.getEntities());

    this.init();
  }

}
