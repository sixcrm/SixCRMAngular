import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductsService} from "../../../shared/services/products.service";
import {Product} from "../../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
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
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(productsService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Product Name', (e: Product) => e.name),
      new ColumnParams('SKU',(e: Product) => e.sku),
      new ColumnParams('Ship', (e: Product) => e.ship),
      new ColumnParams('Shipping Delay', (e: Product) => e.shippingDelay, 'right')
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
