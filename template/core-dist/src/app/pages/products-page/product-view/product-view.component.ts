import { Component, OnInit } from '@angular/core';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit {

  private product: Product;

  constructor(
    private productsService: ProductsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(productsService, route, progressBarService);
  }

  ngOnInit() {
    this.productsService.entity$.subscribe((product: Product) => {
      this.product = product;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }

}
