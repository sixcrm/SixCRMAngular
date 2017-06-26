import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'merchant-provider',
  templateUrl: './merchant-provider.component.html',
  styleUrls: ['./merchant-provider.component.scss']
})
export class MerchantProviderComponent extends AbstractEntityComponent<MerchantProvider> implements OnInit {

  constructor(service: MerchantProvidersService, progressBarService: ProgressBarService) {
    super(service, progressBarService);
  }

  ngOnInit() {
    this.init();
  }
}
