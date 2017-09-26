import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {LoadBalancer} from '../../../shared/models/load-balancer.model';
import {getPhoneNumberMask} from '../../../shared/utils/mask.utils';
import {MerchantProviderAddNewComponent} from './merchant-provider-add-new/merchant-provider-add-new.component';

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

  loadBalancerColumnParams = [new ColumnParams('ID', (e: LoadBalancer) => e.name || e.id)];
  loadBalancerMapper = (l: LoadBalancer) => l.name || l.id;

  constructor(service: MerchantProvidersService, route: ActivatedRoute, public navigation: NavigationService) {
    super(service, route);
  }

  ngOnInit() {
    this.init();

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
}
