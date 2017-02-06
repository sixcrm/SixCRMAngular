import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../shared/services/products.service";
import {Product} from "../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent implements OnInit {

  private products: Product[] = [];

  constructor(private productsService: ProductsService, router: Router, route: ActivatedRoute) {
    super(productsService, router, route);
  }

  ngOnInit() {
    this.productsService.products$.subscribe((data) => this.products = data);
    this.productsService.getProducts();
  }
}
