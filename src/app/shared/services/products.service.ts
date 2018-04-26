import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  productsListQuery, productQuery, deleteProductMutation,
  createProductMutation, updateProductMutation, deleteProductsMutation
} from '../utils/queries/entities/product.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class ProductsService extends AbstractEntityService<Product> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Product(data),
      productsListQuery,
      productQuery,
      deleteProductMutation,
      deleteProductsMutation,
      createProductMutation,
      updateProductMutation,
      null,
      'product',
      snackBar
    );
  }
}
