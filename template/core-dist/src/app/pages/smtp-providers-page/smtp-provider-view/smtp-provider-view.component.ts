import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';

@Component({
  selector: 'c-smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit, OnDestroy {

  private smtpProvider: SmtpProvider;
  private smtpProviderBackup: SmtpProvider;

  constructor(private smtpProvidersService: SmtpProvidersService, route: ActivatedRoute) {
    super(smtpProvidersService, route);
  }

  ngOnInit(): void {
    this.entityViewSubscription = this.smtpProvidersService.entity$.subscribe(
      (entity: SmtpProvider) => {
        this.smtpProvider = entity;

        if (this.updateMode) {
          this.smtpProviderBackup = Object.assign({}, this.smtpProvider);
        }
      });

    this.entityCreatedSubscription = this.smtpProvidersService.entityCreated$.subscribe(
      (created: SmtpProvider) => {
        this.smtpProvider = created;
        this.addMode = false;
        this.viewMode = true;
        this.mode = 'Created'
      });

    this.entityUpdatedSubscription = this.smtpProvidersService.entityUpdated$.subscribe(
      (updated: SmtpProvider) => {
        this.smtpProvider = updated;
        this.updateMode = false;
        this.viewMode = true;
        this.mode = 'Updated'
      });

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
