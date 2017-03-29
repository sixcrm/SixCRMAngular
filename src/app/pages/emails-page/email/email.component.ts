import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {Email} from '../../../shared/models/email.model';
import {EmailsService} from '../../../shared/services/emails.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent extends AbstractEntityComponent<Email> implements OnInit {

  constructor(service: EmailsService, progressBarService: ProgressBarService) {
    super(service, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
