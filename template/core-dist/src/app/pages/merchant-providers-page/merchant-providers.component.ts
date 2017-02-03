import { Component, OnInit } from '@angular/core';
import {MerchantProvidersService} from "../../shared/services/merchant-providers.service";
import {MerchantProvider} from '../../shared/models/merchant-provider.model';
import {Router} from '@angular/router';

@Component({
  selector: 'merchant-providers',
  templateUrl: './merchant-providers.component.html',
  styleUrls: ['./merchant-providers.component.scss']
})
export class MerchantProvidersComponent implements OnInit {

  private merchantProviders: MerchantProvider[] = [];

  constructor(private merchantProvidersService: MerchantProvidersService, private router: Router) { }

  ngOnInit() {
    this.merchantProvidersService.merchantProviders$.subscribe((providers) => {
      this.merchantProviders = providers;
    });
    this.merchantProvidersService.getMerchantProviders();
  }

  viewMerchantProvider(merchantProvider: MerchantProvider): void {
    this.router.navigateByUrl('/dashboard/merchantProviders/' + merchantProvider.id);
  }

  editMerchantProvider(merchantProvider: MerchantProvider): void {

  }

  deleteMerchantProvider(merchantProvider: MerchantProvider): void {

  }
}
