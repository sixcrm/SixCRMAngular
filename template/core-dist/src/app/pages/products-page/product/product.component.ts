import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends AbstractEntityComponent<Product> implements OnInit {

  fulfillmentProviders: FulfillmentProvider[] = [];

  constructor(service: ProductsService, private fulfillmentProvidersService: FulfillmentProvidersService, progressBarService: ProgressBarService) {
    super(service, progressBarService, () => { return new Product()});
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
