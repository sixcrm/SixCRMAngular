import { Component, OnInit } from '@angular/core';
import {MerchantProvidersService} from "../../shared/services/merchant-providers.service";
import {MerchantProvider} from '../../shared/models/merchant-provider.model';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'merchant-providers',
  templateUrl: './merchant-providers.component.html',
  styleUrls: ['./merchant-providers.component.scss']
})
export class MerchantProvidersComponent extends AbstractEntityIndexComponent<MerchantProvider> implements OnInit {

  private merchantProviders: MerchantProvider[] = [];

  constructor(
    private merchantProvidersService: MerchantProvidersService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(merchantProvidersService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.merchantProvidersService.entities$.subscribe((providers) => {
      this.merchantProviders = providers;
      this.progressBarService.hideTopProgressBar();
    });
    this.merchantProvidersService.entityDeleted$.subscribe(() => this.merchantProvidersService.getEntities());

    this.init();
  }
}
