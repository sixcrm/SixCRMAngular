import { Component, OnInit } from '@angular/core';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'c-fulfillment-provider-view',
  templateUrl: './fulfillment-provider-view.component.html',
  styleUrls: ['./fulfillment-provider-view.component.scss']
})
export class FulfillmentProviderViewComponent implements OnInit {

  private fulfillmentProvider: FulfillmentProvider;

  constructor(private fulfillmentProvidersService: FulfillmentProvidersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fulfillmentProvidersService.entity$.subscribe((data) => this.fulfillmentProvider = data);
    this.route.params.subscribe((params) => this.fulfillmentProvidersService.getEntity(params['id']));
  }
}
