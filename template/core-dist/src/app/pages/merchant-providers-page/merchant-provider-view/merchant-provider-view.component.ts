import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';

@Component({
  selector: 'c-merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit, OnDestroy {

  private merchantProvider: MerchantProvider;
  private merchantProviderBackup: MerchantProvider;

  constructor(private merchantProvidersService: MerchantProvidersService, route: ActivatedRoute) {
    super(merchantProvidersService, route);
  }

  ngOnInit(): void {
    this.entityViewSubscription = this.merchantProvidersService.entity$.subscribe(
      (entity: MerchantProvider) => {
        this.merchantProvider = entity;

        if (this.updateMode) {
          this.merchantProviderBackup = this.merchantProvider.copy();
        }
      });

    this.entityCreatedSubscription = this.merchantProvidersService.entityCreated$.subscribe(
      (entity: MerchantProvider) => {
        this.merchantProvider = entity;
        this.addMode = false;
        this.viewMode = true;
        this.mode = 'Created'
      }
    );

    this.entityUpdatedSubscription = this.merchantProvidersService.entityUpdated$.subscribe(
      (entity: MerchantProvider) => {
        this.merchantProvider = entity;
        this.updateMode = false;
        this.viewMode = true;
        this.mode = 'Updated'
      }
    );

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
