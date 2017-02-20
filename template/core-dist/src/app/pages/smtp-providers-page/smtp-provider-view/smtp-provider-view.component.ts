import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit, OnDestroy {

  constructor(
    private smtpProvidersService: SmtpProvidersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(smtpProvidersService, route, progressBarService);
  }

  ngOnInit(): void {
    if (this.addMode) {
      this.entity = new SmtpProvider();
    }

    this.init();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
