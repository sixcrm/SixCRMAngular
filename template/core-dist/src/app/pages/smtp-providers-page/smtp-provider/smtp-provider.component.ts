import { Component, OnInit } from '@angular/core';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'smtp-provider',
  templateUrl: './smtp-provider.component.html',
  styleUrls: ['./smtp-provider.component.scss']
})
export class SmtpProviderComponent extends AbstractEntityComponent<SmtpProvider> implements OnInit {

  constructor(service: SmtpProvidersService, progressBarService: ProgressBarService) {
    super(service, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
