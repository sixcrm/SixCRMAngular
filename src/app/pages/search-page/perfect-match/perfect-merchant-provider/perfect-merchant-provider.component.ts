import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {MerchantProvider} from '../../../../shared/models/merchant-provider/merchant-provider.model';
import {MerchantProvidersService} from '../../../../shared/services/merchant-providers.service';

@Component({
  selector: 'perfect-merchant-provider',
  templateUrl: './perfect-merchant-provider.component.html',
  styleUrls: ['./perfect-merchant-provider.component.scss']
})
export class PerfectMerchantProviderComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  merchantProvider: MerchantProvider;

  constructor(private merchantProviderService: MerchantProvidersService) {
    super();
  }

  ngOnInit() {
    this.merchantProviderService.entity$.takeUntil(this.unsubscribe$).subscribe(merchantProvider => {
      if (merchantProvider instanceof CustomServerError) {
        this.serverError = merchantProvider;
        return;
      }

      this.serverError = null;
      this.merchantProvider = merchantProvider
    });

    this.merchantProviderService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
