import { Component, OnInit } from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../shared/services/email-templates.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'email-template-view',
  templateUrl: './email-template-view.component.html',
  styleUrls: ['./email-template-view.component.scss']
})
export class EmailTemplateViewComponent extends AbstractEntityViewComponent<EmailTemplate> implements OnInit {

  selectedIndex: number = 0;
  editMode: boolean;

  constructor(
    service: EmailTemplatesService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    public navigation: NavigationService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());
  }

  saveTemplate(): void {

  }

  cancelEdit(): void {
    this.editMode = false;
    this.entity = this.entityBackup.copy();
  }

}
