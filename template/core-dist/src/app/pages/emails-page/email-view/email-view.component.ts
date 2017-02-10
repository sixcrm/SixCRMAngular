import { Component, OnInit } from '@angular/core';
import {EmailsService} from '../../../shared/services/emails.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Email} from '../../../shared/models/email.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent extends AbstractEntityViewComponent<Email> implements OnInit {

  private email: Email;

  constructor(private emailsService: EmailsService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(emailsService, route, progressBarService);
  }

  ngOnInit() {
    this.emailsService.entity$.subscribe((data) => {
      this.email = data;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }

}
