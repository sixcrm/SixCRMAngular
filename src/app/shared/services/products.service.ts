import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  productsListQuery, productQuery, deleteProductMutation,
  createProductMutation, updateProductMutation
} from '../utils/queries/entities/product.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class ProductsService extends AbstractEntityService<Product> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Product(data),
      productsListQuery,
      productQuery,
      deleteProductMutation,
      createProductMutation,
      updateProductMutation,
      'product',
      snackBar
    );
  }
}
