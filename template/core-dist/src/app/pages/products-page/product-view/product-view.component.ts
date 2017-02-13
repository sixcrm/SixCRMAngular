import { Component, OnInit } from '@angular/core';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';

@Component({
  selector: 'c-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit {

  private productBackup: Product;
  private fulfillmentProviders: FulfillmentProvider[] = [];

  constructor(
    private productsService: ProductsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    private fulfillmentProvidersService: FulfillmentProvidersService
  ) {
    super(productsService, route, progressBarService);
  }

  ngOnInit() {
    this.productsService.entity$.subscribe((product: Product) => {
      this.entity = product;

      if (this.updateMode) {
        this.productBackup = product.copy();
      }
      this.progressBarService.hideTopProgressBar();
    });

    if (this.addMode) {
      this.entity = new Product();
    }

    if (this.addMode || this.updateMode) {
      this.fulfillmentProvidersService.entities$.subscribe((data) => {
        this.fulfillmentProviders = data;

        if (this.addMode) {
          this.progressBarService.hideTopProgressBar();
        }
      });

      this.fulfillmentProvidersService.getEntities();
      if (this.addMode) {
        this.progressBarService.showTopProgressBar();
      }
    }

    this.init();
  }

  setShip(value: string): void {
    this.entity.ship = value;
  }

  setFulfillmentProvider(provider: FulfillmentProvider): void {
    this.entity.fulfillmentProvider = provider;
  }

  cancelUpdate(): void {
    this.entity = this.productBackup.copy();
  }

}
