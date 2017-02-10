import { Component, OnInit } from '@angular/core';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-fulfillment-provider-view',
  templateUrl: './fulfillment-provider-view.component.html',
  styleUrls: ['./fulfillment-provider-view.component.scss']
})
export class FulfillmentProviderViewComponent extends AbstractEntityViewComponent<FulfillmentProvider> implements OnInit {

  private fulfillmentProvider: FulfillmentProvider;

  constructor(
    private fulfillmentProvidersService: FulfillmentProvidersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(fulfillmentProvidersService, route, progressBarService);
  }

  ngOnInit() {
    this.fulfillmentProvidersService.entity$.subscribe((data) => {
      this.fulfillmentProvider = data;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }
}
