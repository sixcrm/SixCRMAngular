import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ActivatedRoute} from '@angular/router';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {parseCurrencyMaskedValue} from '../../../shared/utils/mask.utils';
import {Observable} from 'rxjs';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  fulfillmentProviderMapper = (el: FulfillmentProvider) => el.name;

  formInvalid: boolean;

  price: string = '';

  constructor(
    service: ProductsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public fulfillmentProvidersService: FulfillmentProvidersService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.service.entity$.merge(this.service.entityCreated$).merge(this.service.entityUpdated$).takeUntil(this.unsubscribe$)
      .subscribe(product => this.price = product.defaultPrice.amount + '');

    if (this.addMode) {
      this.entity = new Product();
      this.entity.ship = 'true';
      this.entityBackup = this.entity.copy();
      this.fulfillmentProvidersService.getEntities();
    } else {
      this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.fulfillmentProvidersService.getEntities());
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  toggleShip() {
    this.entity.ship = this.entity.ship === 'true' ? 'false' : 'true';
    if (this.entity.ship === 'true') {
      this.entity.shippingDelay = 0;
    } else {
      this.entity.shippingDelay = null;
    }
  }

  save(valid: boolean): void {
    this.formInvalid = !valid;

    if (this.formInvalid) {

    } else {
      this.entity.defaultPrice.amount = parseCurrencyMaskedValue(this.price);
      this.saveOrUpdate(this.entity);
    }
  }

}
