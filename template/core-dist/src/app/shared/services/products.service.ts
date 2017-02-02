import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Subject} from "rxjs";
import {Http, Headers} from "@angular/http";
import {
  productsListQuery, deleteProductMutation, createProductMutation,
  editProductMutation
} from "./../utils/query-builder"
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';

@Injectable()
export class ProductsService {
  products$: Subject<Product[]>;

  constructor(private http: Http, private authService: AuthenticationService) {
    this.products$ = new Subject<Product[]>();
  }

  getProducts(): void {
    this.http.post(environment.endpoint, productsListQuery(false), { headers: this.generateHeaders() })
      .subscribe(
        (data) => {
          let productsData = data.json().data.productlist.products;
          this.products$.next(productsData.map(product => new Product(product)));
        },
        (error) => {
          console.error(error);
        }
      );
  }

  deleteProduct(id: string): void {
    this.http.post(environment.endpoint, deleteProductMutation(id), { headers: this.generateHeaders()})
      .subscribe(
        () => { this.getProducts() },
        (error) => { console.error(error) }
      );
  }

  createProduct(product: Product): void {
    this.http.post(environment.endpoint, createProductMutation(product.id, product.name, product.sku), { headers: this.generateHeaders()})
      .subscribe(
        () => { this.getProducts() },
        (error) => { console.error(error) }
      );
  }

  editProduct(product: Product): void {
    this.http.post(environment.endpoint, editProductMutation(product.id, product.name, product.sku), { headers: this.generateHeaders()})
      .subscribe(
        () => { this.getProducts() },
        (error) => { console.error(error) }
      );
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }

}
