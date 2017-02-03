import { Component, OnInit } from '@angular/core';
import {MerchantProvidersService} from "../../shared/services/merchant-providers.service";
import {MerchantProvider} from '../../shared/models/merchant-provider.model';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';

@Component({
  selector: 'merchant-providers',
  templateUrl: './merchant-providers.component.html',
  styleUrls: ['./merchant-providers.component.scss']
})
export class MerchantProvidersComponent extends AbstractEntityIndexComponent implements OnInit {

  private merchantProviders: MerchantProvider[] = [];

  constructor(private merchantProvidersService: MerchantProvidersService, router: Router, route: ActivatedRoute) {
    super(merchantProvidersService, router, route);
  }

  ngOnInit() {
    this.merchantProvidersService.merchantProviders$.subscribe((providers) => {
      this.merchantProviders = providers;
    });
    this.merchantProvidersService.getMerchantProviders();
  }
}
