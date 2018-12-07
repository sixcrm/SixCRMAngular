import {Component, OnInit, Input} from '@angular/core';
import {Product} from '../../../shared/models/product.model';

@Component({
  selector: 'products-gallery',
  templateUrl: './products-gallery.component.html',
  styleUrls: ['./products-gallery.component.scss']
})
export class ProductsGalleryComponent implements OnInit {

  @Input() products: Product[] = [];

  constructor() { }

  ngOnInit() {
  }

}
