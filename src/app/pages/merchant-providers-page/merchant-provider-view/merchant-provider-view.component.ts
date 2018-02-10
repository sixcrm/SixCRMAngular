import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {LoadBalancer} from '../../../shared/models/load-balancer.model';
import {MerchantProviderAddNewComponent} from './merchant-provider-add-new/merchant-provider-add-new.component';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit, OnDestroy {

  @ViewChild('nameFieldAddMode') nameField;
  @ViewChild(MerchantProviderAddNewComponent) merchantProviderAddNewComponent: MerchantProviderAddNewComponent;

  selectedIndex: number = 0;
  formInvalid: boolean;

  loadBalancerColumnParams = [
    new ColumnParams('MERCHANTPROVIDER_LOADBALANCER_NAME', (e: LoadBalancer) => e.name || e.id)
  ];
  loadBalancerMapper = (l: LoadBalancer) => l.name || l.id;
  loadbalancerText: TableMemoryTextOptions = {
    title: 'MERCHANTPROVIDER_LOADBALANCER_TITLE',
    viewOptionText: 'MERCHANTPROVIDER_LOADBALANCER_VIEW',
    noDataText: 'MERCHANTPROVIDER_LOADBALANCER_NODATA'
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'MERCHANTPROVIDER_TAB_GENERAL'},
    {name: 'precessing', label: 'MERCHANTPROVIDER_TAB_PROCESSING'},
    {name: 'merchantprovidergroups', label: 'MERCHANTPROVIDER_TAB_LOADBALANCER'}
  ];

  constructor(
    service: MerchantProvidersService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    private router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new MerchantProvider();
      this.entityBackup = this.entity.copy();
      setTimeout(() => {if (this.nameField && this.nameField.nativeElement) this.nameField.nativeElement.focus()}, 50);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  cancelEdit(): void {
    this.formInvalid = false;
    this.cancelUpdate();
  }

  saveProvider(entity: MerchantProvider): void {
    this.formInvalid = !this.merchantProviderAddNewComponent.inputForm.valid || !entity.gateway.name;
    if (this.formInvalid) return;

    this.saveOrUpdate(entity);
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  navigateToLoadBalancer(loadBalancer: LoadBalancer): void {
    this.router.navigate(['/merchantprovidergroups', loadBalancer.id]);
  }
}
