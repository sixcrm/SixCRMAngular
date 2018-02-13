import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductsService} from "../../../shared/services/products.service";
import {Product} from "../../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {UserSettingsService} from '../../../shared/services/user-settings.service';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent<Product> implements OnInit, OnDestroy {

  price: string;

  constructor(
    productsService: ProductsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    userSettingsService: UserSettingsService
  ) {
    super(productsService, auth, dialog, paginationService, router, activatedRoute, userSettingsService);

    this.entityFactory = () => new Product();

    this.columnParams = [
      new ColumnParams('PRODUCT_INDEX_HEADER_NAME', (e: Product) => e.name),
      new ColumnParams('PRODUCT_INDEX_HEADER_SKU',(e: Product) => e.sku),
      new ColumnParams('PRODUCT_INDEX_HEADER_SHIP', (e: Product) => e.ship + ''),
      new ColumnParams('PRODUCT_INDEX_HEADER_DELAY', (e: Product) => e.shippingDelay, 'right').setNumberOption(true)
    ];
  }

  openAddMode() {
    super.openAddMode();
    this.price = '';
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
