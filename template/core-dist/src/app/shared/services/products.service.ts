import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Subject} from "rxjs";
import {Http, Headers} from "@angular/http";

@Injectable()
export class ProductsService {

  private auth =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTNiMDg2YjgtNjM0My00MjcxLTg3ZDYtYjJhMDAxNDlmMDcwIiwiaWF0IjoxNDg2MDI3Mzc2fQ.WWso40RRK-xHIvMOm2NEFGEnQHkJH2KQq_FWShkQ0GM';
  private allProductsQuery =
  `{
        productlist{
          products {
            id,
            name,
            sku
          }
        }
       }`;
  private endpoint = 'https://9xq4cs3cq1.execute-api.us-east-1.amazonaws.com/development/graph';
  products$: Subject<Product[]>;

  constructor(private http: Http) {
    this.products$ = new Subject<Product[]>();
  }

  getProducts(): void {
    let head = new Headers();
    head.append('Authorization', this.auth);

    this.http.post(this.endpoint, this.allProductsQuery, { headers: head }).subscribe(
      (data) => {
        this.products$.next(data.json().data.productlist.products);
      },
      (error) => {
        console.log('ERROR', error);
      }
    );
  }

}
