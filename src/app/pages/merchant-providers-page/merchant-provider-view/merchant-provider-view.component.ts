import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {LoadBalancer} from '../../../shared/models/load-balancers.model';

@Component({
  selector: 'merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

  loadBalancerColumnParams = [new ColumnParams('ID', (e: LoadBalancer) => e.id)];
  loadBalancerMapper = (l: LoadBalancer) => l.id;

  constructor(service: MerchantProvidersService, route: ActivatedRoute, progressBarService: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();

    if (this.addMode) {
      this.entity = new MerchantProvider();
      this.entity.processor = 'NMI';
      this.entityBackup = this.entity.copy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  saveProvider(valid: boolean): void {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.saveOrUpdate(this.entity);
  }
}
