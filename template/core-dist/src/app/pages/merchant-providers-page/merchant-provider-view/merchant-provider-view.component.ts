import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit, OnDestroy {

  constructor(
    private merchantProvidersService: MerchantProvidersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(merchantProvidersService, route, progressBarService);
  }

  ngOnInit(): void {
    if (this.addMode) {
      this.entity = new MerchantProvider();
    }

    this.init();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
