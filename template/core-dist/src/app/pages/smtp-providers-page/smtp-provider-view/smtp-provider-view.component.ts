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

  private smtpProvider: SmtpProvider;
  private smtpProviderBackup: SmtpProvider;

  constructor(
    private smtpProvidersService: SmtpProvidersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(smtpProvidersService, route, progressBarService);
  }

  ngOnInit(): void {
    this.entityViewSubscription = this.smtpProvidersService.entity$.subscribe(
      (entity: SmtpProvider) => {
        this.smtpProvider = entity;
        this.progressBarService.hideTopProgressBar();

        if (this.updateMode) {
          this.smtpProviderBackup = Object.assign({}, this.smtpProvider);
        }
      });

    this.entityCreatedSubscription = this.smtpProvidersService.entityCreated$.subscribe(
      (created: SmtpProvider) => {
        this.smtpProvider = created;
        this.addMode = false;
        this.viewMode = true;
        this.mode = 'Created';
        this.progressBarService.hideTopProgressBar();
      });

    this.entityUpdatedSubscription = this.smtpProvidersService.entityUpdated$.subscribe(
      (updated: SmtpProvider) => {
        this.smtpProvider = updated;
        this.updateMode = false;
        this.viewMode = true;
        this.mode = 'Updated';
        this.progressBarService.hideTopProgressBar();
      });

    this.init();

    if (this.addMode) {
      this.smtpProvider = new SmtpProvider();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  cancelUpdate(): void {
    this.smtpProvider = Object.assign({}, this.smtpProviderBackup);
  }
}
