import { Component, OnInit } from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {SmtpProvidersService} from '../../shared/services/smtp-providers.service';
import {Router, ActivatedRoute} from '@angular/router';
import {SmtpProvider} from '../../shared/models/smtp-provider.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'c-smtp-providers',
  templateUrl: './smtp-providers.component.html',
  styleUrls: ['./smtp-providers.component.scss']
})
export class SmtpProvidersComponent extends AbstractEntityIndexComponent<SmtpProvider> implements OnInit {

  constructor(
    private smtpProvidersService: SmtpProvidersService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(smtpProvidersService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.smtpProvidersService.entityDeleted$.subscribe((data) => this.smtpProvidersService.getEntities());

    this.init();
  }

}
