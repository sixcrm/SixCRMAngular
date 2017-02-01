import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../shared/services/products.service";
import {Product} from "../../shared/models/product.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  private products: Product[] = [];
  private productsSearchControl: FormControl = new FormControl();
  private searchString: string = '';

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });

    this.productsService.getProducts();
  }

  editProductModal(product: Product): void {

  }

  deleteProduct(product: Product): void {

  }

}
