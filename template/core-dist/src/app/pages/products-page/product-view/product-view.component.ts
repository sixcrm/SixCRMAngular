import { Component, OnInit } from '@angular/core';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  private product: Product;

  constructor(private productsService: ProductsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.productsService.entity$.subscribe((product: Product) => this.product = product);
    this.route.params.subscribe((params: Params) => this.productsService.getEntity(params['id']));
  }

}
