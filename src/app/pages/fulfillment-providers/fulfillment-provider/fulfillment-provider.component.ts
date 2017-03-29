import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'fulfillment-provider',
  templateUrl: './fulfillment-provider.component.html',
  styleUrls: ['./fulfillment-provider.component.scss']
})
export class FulfillmentProviderComponent extends AbstractEntityComponent<FulfillmentProvider> implements OnInit {

  constructor(
    service: FulfillmentProvidersService,
    progressBarService: ProgressBarService,
  ) {
    super(service, progressBarService, () => { return new FulfillmentProvider() });
  }

  ngOnInit() {
    this.init();
  }

}
