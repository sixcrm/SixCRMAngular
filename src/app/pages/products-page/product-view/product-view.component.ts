import {Component, OnInit, OnDestroy} from '@angular/core';
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
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  fulfillmentProviderMapper = (el: FulfillmentProvider) => el.name;

  constructor(
    service: ProductsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    public navigation: NavigationService,
    public fulfillmentProvidersService: FulfillmentProvidersService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());
    if (this.addMode) {
      this.entity = new Product();
      this.entityBackup = new Product();
    }
    this.fulfillmentProvidersService.getEntities();
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

}
