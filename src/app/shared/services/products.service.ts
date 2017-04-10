import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Http} from "@angular/http";
import {
  productsListQuery, deleteProductMutation, updateProductMutation, productQuery, createProductMutation
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
      deleteProductMutation,
      createProductMutation,
      updateProductMutation,
      'product'
    );
  }
}
