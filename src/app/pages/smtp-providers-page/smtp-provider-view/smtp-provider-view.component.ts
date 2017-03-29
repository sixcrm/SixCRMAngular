import { Component, OnInit } from '@angular/core';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';

@Component({
  selector: 'smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit {

  constructor(service: SmtpProvidersService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    super.init();
  }

}
