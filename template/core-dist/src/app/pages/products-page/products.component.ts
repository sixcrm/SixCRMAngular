import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../shared/services/products.service";

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
  }

}
