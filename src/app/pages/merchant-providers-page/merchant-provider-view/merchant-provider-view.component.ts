import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {LoadBalancer} from '../../../shared/models/load-balancer.model';

@Component({
  selector: 'merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit, OnDestroy {

  @ViewChild('nameFieldAddMode') nameField;

  selectedIndex: number = 0;
  formInvalid: boolean;

  loadBalancerColumnParams = [new ColumnParams('ID', (e: LoadBalancer) => e.id)];
  loadBalancerMapper = (l: LoadBalancer) => l.id;

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

  saveProvider(valid: boolean): void {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.saveOrUpdate(this.entity);
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }
}
