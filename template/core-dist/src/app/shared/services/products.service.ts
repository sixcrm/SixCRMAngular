import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Subject} from "rxjs";
import {Http} from "@angular/http";
import {
  productsListQuery, deleteProductMutation, editProductMutation, productQuery
} from "./../utils/query-builder"
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';

@Injectable()
export class ProductsService extends AbstractEntityService {
  products$: Subject<Product[]>;
  product$: Subject<Product>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);

    this.products$ = new Subject<Product[]>();
    this.product$ = new Subject<Product>();
  }

  getProducts(): void {
    this.queryRequest(productsListQuery()).subscribe(
      (data) => {
        let productsData = data.json().data.productlist.products;
        this.products$.next(productsData.map(product => new Product(product)));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getProduct(id: string): void {
    this.queryRequest(productQuery(id)).subscribe(
      (data) => {
        let productData = data.json().data.product;
        this.product$.next(new Product(productData));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteEntity(id: string): void {
    this.queryRequest(deleteProductMutation(id)).subscribe(
      () => { this.getProducts() },
      (error) => { console.error(error) }
    );
  }

  editEntity(product: Product): void {
    this.queryRequest(editProductMutation(product.id, product.name, product.sku)).subscribe(
      () => { this.getProducts() },
      (error) => { console.error(error) }
    );
  }
}
