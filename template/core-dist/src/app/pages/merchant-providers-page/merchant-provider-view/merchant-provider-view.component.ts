import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit, OnDestroy {

  private merchantProvider: MerchantProvider;
  private merchantProviderBackup: MerchantProvider;

  constructor(
    private merchantProvidersService: MerchantProvidersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(merchantProvidersService, route, progressBarService);
  }

  ngOnInit(): void {
    this.entityViewSubscription = this.merchantProvidersService.entity$.subscribe(
      (entity: MerchantProvider) => {
        this.merchantProvider = entity;
        this.progressBarService.hideTopProgressBar();

        if (this.updateMode) {
          this.merchantProviderBackup = this.merchantProvider.copy();
        }
      });

    this.entityCreatedSubscription = this.merchantProvidersService.entityCreated$.subscribe(
      (entity: MerchantProvider) => {
        this.merchantProvider = entity;
        this.addMode = false;
        this.viewMode = true;
        this.mode = 'Created';
        this.progressBarService.hideTopProgressBar();
      }
    );

    this.entityUpdatedSubscription = this.merchantProvidersService.entityUpdated$.subscribe(
      (entity: MerchantProvider) => {
        this.merchantProvider = entity;
        this.updateMode = false;
        this.viewMode = true;
        this.mode = 'Updated';
        this.progressBarService.hideTopProgressBar()
      }
    );

    this.init();

    if (this.addMode) {
      this.merchantProvider = new MerchantProvider();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private cancelUpdate(): void {
    this.merchantProvider = this.merchantProviderBackup.copy();
  }
}
