import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Product} from '../../../shared/models/product.model';
import {scrollByX} from '../../../shared/utils/document.utils';

@Component({
  selector: 'products-gallery',
  templateUrl: './products-gallery.component.html',
  styleUrls: ['./products-gallery.component.scss']
})
export class ProductsGalleryComponent implements OnInit {

  @ViewChild('gallerycontainer') galleryContainer;

  @Input() products: Product[] = [];

  productWidth = 320;
  scrollOffset = 280;

  constructor() { }

  ngOnInit() {
  }

  showLeft() {
    return this.galleryContainer.nativeElement.scrollLeft > 0;
  }

  showRight() {
    return this.galleryContainer.nativeElement.scrollLeft < this.products.length * this.productWidth - this.galleryContainer.nativeElement.clientWidth;
  }

  moveRight() {
    const max = this.products.length * this.productWidth - this.galleryContainer.nativeElement.clientWidth;
    const next = this.galleryContainer.nativeElement.scrollLeft + this.scrollOffset;

    scrollByX(this.galleryContainer, next > (max - 60) ? max : next);
  }

  moveLeft() {
    const next = this.galleryContainer.nativeElement.scrollLeft - this.scrollOffset;

    scrollByX(this.galleryContainer, next < 60 ? 0 : next);
  }

}
