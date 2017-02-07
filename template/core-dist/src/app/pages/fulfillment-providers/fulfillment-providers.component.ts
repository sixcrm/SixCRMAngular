import { Component, OnInit } from '@angular/core';
import {FulfillmentProvidersService} from "../../shared/services/fulfillment-providers.service";
import {FulfillmentProvider} from '../../shared/models/fulfillment-provider.model';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';

@Component({
  selector: 'fulfillment-providers',
  templateUrl: './fulfillment-providers.component.html',
  styleUrls: ['./fulfillment-providers.component.scss']
})
export class FulfillmentProvidersComponent extends AbstractEntityIndexComponent implements OnInit {
  private fulfillmentProviders: FulfillmentProvider[] = [];

  constructor(private fulfillmentProvidersService: FulfillmentProvidersService, router: Router, route: ActivatedRoute) {
    super(fulfillmentProvidersService, router, route)
  }

  ngOnInit() {
    this.fulfillmentProvidersService.entities$.subscribe((data) => this.fulfillmentProviders = data);
    this.fulfillmentProvidersService.getEntities()
  }
}
