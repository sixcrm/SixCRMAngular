import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit {

  constructor(service: MerchantProvidersService, route: ActivatedRoute, progressBarService: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
