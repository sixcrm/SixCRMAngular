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
export class ProductsService extends AbstractEntityService<Product> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Product(data),
      productsListQuery,
      productQuery,
      deleteProductMutation
    );
  }

  editEntity(product: Product): void {
    this.queryRequest(editProductMutation(product.id, product.name, product.sku)).subscribe(
      () => { this.getEntities() },
      (error) => { console.error(error) }
    );
  }
}
