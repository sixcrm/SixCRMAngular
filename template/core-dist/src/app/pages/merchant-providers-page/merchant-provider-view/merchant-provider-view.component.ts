import { Component, OnInit } from '@angular/core';
import {MerchantProvider} from '../../../shared/models/merchant-provider.model';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'c-merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent implements OnInit {
  private merchantProvider: MerchantProvider;

  constructor(private merchantProvidersService: MerchantProvidersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.merchantProvidersService.merchantProvider$.subscribe((data) => this.merchantProvider = data);
    this.route.params.subscribe((params) => this.merchantProvidersService.getMerchantProvider(params['id']));
  }
}
