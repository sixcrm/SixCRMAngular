import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'fulfillment-view',
  templateUrl: './fulfillment-view.component.html',
  styleUrls: ['./fulfillment-view.component.scss']
})
export class FulfillmentViewComponent extends AbstractEntityViewComponent<FulfillmentProvider> implements OnInit {

  constructor(service: FulfillmentProvidersService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
