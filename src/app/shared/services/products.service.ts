import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Http} from "@angular/http";
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  productsListQuery, productQuery, deleteProductMutation,
  createProductMutation, updateProductMutation
} from '../utils/queries/entities/product.queries';

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
