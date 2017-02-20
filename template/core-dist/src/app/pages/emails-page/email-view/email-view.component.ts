import {Component, OnInit, OnDestroy} from '@angular/core';
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
export class EmailViewComponent extends AbstractEntityViewComponent<Email> implements OnInit, OnDestroy {

  private email: Email;

  constructor(private emailsService: EmailsService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(emailsService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new Email();
    }

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
