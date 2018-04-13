import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductsService} from "../../../shared/services/products.service";
import {Product} from "../../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MatDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent<Product> implements OnInit, OnDestroy {

  constructor(
    productsService: ProductsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(productsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Product();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('PRODUCT_INDEX_HEADER_ID', (e: Product) => e.id).setSelected(false),
      new ColumnParams('PRODUCT_INDEX_HEADER_NAME', (e: Product) => e.name),
      new ColumnParams('PRODUCT_INDEX_HEADER_PRICE', (e: Product) => e.defaultPrice.usd(), 'right'),
      new ColumnParams('PRODUCT_INDEX_HEADER_SKU',(e: Product) => e.sku),
      new ColumnParams('PRODUCT_INDEX_HEADER_SHIP', (e: Product) => e.ship + ''),
      new ColumnParams('PRODUCT_INDEX_HEADER_DELAY', (e: Product) => e.shippingDelay, 'right').setNumberOption(true),
      new ColumnParams('PRODUCT_INDEX_HEADER_PROVIDER', (e: Product) => e.fulfillmentProvider.name).setSelected(false),
      new ColumnParams('PRODUCT_INDEX_HEADER_CREATED', (e: Product) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('PRODUCT_INDEX_HEADER_UPDATED', (e: Product) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  openAddMode() {
    super.openAddMode();
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
