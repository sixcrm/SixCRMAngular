import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {LoadBalancer} from '../../../shared/models/load-balancer.model';
import {LoadBalancersService} from '../../../shared/services/load-balancers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {MerchantProviderConfiguration} from '../../../shared/models/merchant-provider-configuration.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';

@Component({
  selector: 'load-balancer-view',
  templateUrl: './load-balancer-view.component.html',
  styleUrls: ['./load-balancer-view.component.scss']
})
export class LoadBalancerViewComponent extends AbstractEntityViewComponent<LoadBalancer> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  merchantProviderColumnParams = [
    new ColumnParams('Merchant Provider', (e: MerchantProviderConfiguration) => e.merchantProvider.name),
    new ColumnParams('Distribution',(e: MerchantProviderConfiguration) => e.distribution, 'right')
  ];
  merchantProviderConfigMapper = (e: MerchantProviderConfiguration) => e.merchantProvider.name;

  providerToAdd: MerchantProviderConfiguration = new MerchantProviderConfiguration();
  merchantProviderMapper = (e: MerchantProvider) => e.name;

  formInvalid: boolean;
  detailsFormInvalid: boolean;

  constructor(service: LoadBalancersService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              public router: Router,
              public merchantProviderService: MerchantProvidersService
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new LoadBalancer();
      this.entityBackup = this.entity.copy();
      this.merchantProviderService.getEntities();
    }

    this.service.entity$.take(1).subscribe(() => this.merchantProviderService.getEntities());
    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(() => this.clearAddProvider());
  }

  ngOnDestroy() {
    this.destroy();
  }

  navigateToMerchantProvider(config: MerchantProviderConfiguration): void {
    this.router.navigate(['/merchantproviders', config.merchantProvider.id]);
  }

  disassociateMerchantProvider(merchantProviderConfig: MerchantProviderConfiguration): void {
    let index = firstIndexOf(this.entity.merchantProviderConfigurations, (el: MerchantProviderConfiguration) => {
      return el.distribution === merchantProviderConfig.distribution
              && el.merchantProvider.id === merchantProviderConfig.merchantProvider.id;
    });

    if (index > -1) {
      this.entity.merchantProviderConfigurations.splice(index, 1);
      this.updateEntity(this.entity);
    }
  }

  clearAddProvider(): void {
    this.formInvalid = false;
    this.providerToAdd = new MerchantProviderConfiguration();
  }

  addProvider(valid: boolean): void {
    this.formInvalid = !valid;

    if (this.formInvalid) return;

    this.entity.merchantProviderConfigurations.push(this.providerToAdd);
    if (!this.addMode) {
      this.updateEntity(this.entity);
    } else {
      this.entity.merchantProviderConfigurations = this.entity.merchantProviderConfigurations.slice();
      this.clearAddProvider();
    }
  }

  canBeDeactivated() {
    return !this.providerToAdd.merchantProvider.id && !this.providerToAdd.distribution && this.checkIfChanged();
  }

  updateLoadBalancer() {
    this.detailsFormInvalid = !this.entity.name;
    if (this.detailsFormInvalid) return;

    this.saveOrUpdate(this.entity);
  }
}
