import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../shared/services/products.service";
import {Product} from "../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Router, ActivatedRoute} from '@angular/router';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent<Product> implements OnInit {

  private products: Product[] = [];

  constructor(private productsService: ProductsService, router: Router, route: ActivatedRoute, dialog: MdDialog) {
    super(productsService, router, route, dialog);
  }

  ngOnInit() {
    this.productsService.entities$.subscribe((data) => this.products = data);
    this.productsService.getEntities();
  }
}
