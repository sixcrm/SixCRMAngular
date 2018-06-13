import {Component, OnInit, Input} from '@angular/core';
import {Products} from '../../../../shared/models/products.model';
import {Product} from '../../../../shared/models/product.model';

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() product: Products;

  constructor() { }

  ngOnInit() {
  }

  getProductImage(product: Product) {
    return product.getDefaultImage() ? product.getDefaultImage().path : null;
  }

}
