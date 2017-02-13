import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoadBalancer} from '../../../shared/models/load-balancers.model';
import {LoadBalancersService} from '../../../shared/services/load-balancers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProviderConfiguration} from '../../../shared/models/merchant-provider-configuration.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {Subscription} from 'rxjs';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-load-balancer-view',
  templateUrl: './load-balancer-view.component.html',
  styleUrls: ['./load-balancer-view.component.scss']
})
export class LoadBalancerViewComponent extends AbstractEntityViewComponent<LoadBalancer> implements OnInit, OnDestroy {

  private merchantProviders: MerchantProvider[] = [];
  private merchantProvidersSubscription: Subscription;

  constructor(
    private loadBalancersService: LoadBalancersService,
    private merchantProvidersService: MerchantProvidersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(loadBalancersService, route, progressBarService);
  }

  ngOnInit(): void {
    if (this.addMode) {
      this.entity = new LoadBalancer();
    }

    if (this.addMode || this.updateMode) {
      this.merchantProvidersSubscription = this.merchantProvidersService.entities$.subscribe(
        (providers: MerchantProvider[]) => {
          this.merchantProviders = providers;

          if (this.addMode) {
            this.progressBarService.hideTopProgressBar();
          }
        }
      );
      this.merchantProvidersService.getEntities();
      if (this.addMode) {
        this.progressBarService.showTopProgressBar();
      }
    }

    this.init();
  }

  ngOnDestroy(): void {
    this.destroy();

    if (this.merchantProvidersSubscription) {
      this.merchantProvidersSubscription.unsubscribe();
    }
  }

  addNewConfiguration(merchantProvider: MerchantProvider): void {
    this.entity.merchantProviderConfigurations.push(
      new MerchantProviderConfiguration({merchantprovider: merchantProvider})
    );
  }

  removeConfiguration(index: number): void {
    this.entity.merchantProviderConfigurations.splice(index, 1);
  }
}
