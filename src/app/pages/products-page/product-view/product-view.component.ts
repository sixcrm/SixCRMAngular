import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {ActivatedRoute} from '@angular/router';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit {

  fulfillmentProviders: FulfillmentProvider[] = [];

  constructor(
    service: ProductsService,
    private fulfillmentProvidersService: FulfillmentProvidersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    public navigation: NavigationService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();

    this.fulfillmentProvidersService.entities$.subscribe((entities: FulfillmentProvider[]) => {
      this.fulfillmentProviders = entities;
    });
    this.fulfillmentProvidersService.getEntities();
  }

  selectFulfillmentProvider(provider): void {
    this.entity.fulfillmentProvider = provider;
  }

}
