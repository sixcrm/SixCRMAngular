import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Subject} from "rxjs";

@Injectable()
export class ProductsService {

  private productsData: Product[] = [
    new Product({id: '1111', name: 'first', sku: 'first sku'}),
    new Product({id: '2222', name: 'second', sku: 'second sku'}),
    new Product({id: '3333', name: 'third', sku: 'third sku'})
  ];

  products$: Subject<Product[]>;

  constructor() {
    this.products$ = new Subject<Product[]>();
  }

  getProducts(): void {
    this.products$.next(this.productsData);
  }

}
