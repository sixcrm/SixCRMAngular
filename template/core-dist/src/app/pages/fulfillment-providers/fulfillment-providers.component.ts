import { Component, OnInit } from '@angular/core';
import {FulfillmentProvidersService} from "../../shared/services/fulfillment-providers.service";
import {FulfillmentProvider} from '../../shared/models/fulfillment-provider.model';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'fulfillment-providers',
  templateUrl: './fulfillment-providers.component.html',
  styleUrls: ['./fulfillment-providers.component.scss']
})
export class FulfillmentProvidersComponent extends AbstractEntityIndexComponent<FulfillmentProvider> implements OnInit {
  private fulfillmentProviders: FulfillmentProvider[] = [];

  constructor(
    private fulfillmentProvidersService: FulfillmentProvidersService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog
  ) {
    super(fulfillmentProvidersService, router, route, dialog)
  }

  ngOnInit() {
    this.fulfillmentProvidersService.entities$.subscribe((data) => this.fulfillmentProviders = data);
    this.fulfillmentProvidersService.getEntities()
  }
}
