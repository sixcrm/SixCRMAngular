import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoadBalancer} from '../../../shared/models/load-balancers.model';
import {LoadBalancersService} from '../../../shared/services/load-balancers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProviderConfiguration} from '../../../shared/models/merchant-provider-configuration.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'c-load-balancer-view',
  templateUrl: './load-balancer-view.component.html',
  styleUrls: ['./load-balancer-view.component.scss']
})
export class LoadBalancerViewComponent extends AbstractEntityViewComponent<LoadBalancer> implements OnInit, OnDestroy {

  private loadBalancer: LoadBalancer;
  private loadBalancerBackup: LoadBalancer;
  private merchantProviders: MerchantProvider[] = [];
  private merchantProvidersSubscription: Subscription;

  constructor(
    private loadBalancersService: LoadBalancersService,
    private merchantProvidersService: MerchantProvidersService,
    route: ActivatedRoute
  ) {
    super(loadBalancersService, route);
  }

  ngOnInit(): void {
    this.entityViewSubscription = this.loadBalancersService.entity$.subscribe((entity: LoadBalancer) => {
        this.loadBalancer = entity;

        if (this.updateMode) {
          this.loadBalancerBackup = this.loadBalancer.copy();
        }
      });

    this.entityCreatedSubscription = this.loadBalancersService.entityCreated$.subscribe((entity: LoadBalancer) => {
        this.loadBalancer = entity;
        this.viewMode = true;
        this.addMode = false;
        this.mode = 'Created';
      });

    this.entityUpdatedSubscription = this.loadBalancersService.entityUpdated$.subscribe((entity: LoadBalancer) => {
        this.loadBalancer = entity;
        this.viewMode = true;
        this.updateMode = false;
        this.mode = 'Updated';
      });

    if (this.addMode) {
      this.loadBalancer = new LoadBalancer();
    }

    if (!this.viewMode) {
      this.merchantProvidersSubscription = this.merchantProvidersService.entities$.subscribe(
        (providers: MerchantProvider[]) => this.merchantProviders = providers
      );
      this.merchantProvidersService.getEntities();
    }
  }

  ngOnDestroy(): void {
    this.destroy();

    if (this.merchantProvidersSubscription) {
      this.merchantProvidersSubscription.unsubscribe();
    }
  }

  private addNewConfiguration(merchantProvider: MerchantProvider): void {
    this.loadBalancer.merchantProviderConfigurations.push(
      new MerchantProviderConfiguration({merchantprovider: merchantProvider})
    );
  }

  private removeConfiguration(index: number): void {
    this.loadBalancer.merchantProviderConfigurations.splice(index, 1);
  }

  private cancelUpdate(): void {
    this.loadBalancer = this.loadBalancerBackup.copy();
  }
}
