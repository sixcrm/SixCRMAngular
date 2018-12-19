import {Component, OnInit, ContentChildren, QueryList, ViewChild, Input} from '@angular/core';
import {SliderGalleryItemDirective} from './slider-gallery-item.directive';
import {scrollByX} from '../../utils/document.utils';

@Component({
  selector: 'slider-gallery',
  templateUrl: './slider-gallery.component.html',
  styleUrls: ['./slider-gallery.component.scss']
})
export class SliderGalleryComponent implements OnInit {

  @ViewChild('gallerycontainer') galleryContainer;
  @ContentChildren(SliderGalleryItemDirective) items: QueryList<SliderGalleryItemDirective>;

  @Input() scrollOffset: number = 280;

  constructor() { }

  ngOnInit() {
  }

  showLeft() {
    return this.galleryContainer.nativeElement.scrollLeft > 0;
  }

  showRight() {
    return this.galleryContainer.nativeElement.scrollLeft < this.items.map(i => i.getWidth()).reduce((a,b)=>a+b,0) - this.galleryContainer.nativeElement.clientWidth;
  }

  moveRight() {
    const max = this.items.map(i => i.getWidth()).reduce((a,b)=>a+b,0) - this.galleryContainer.nativeElement.clientWidth;
    const next = this.galleryContainer.nativeElement.scrollLeft + this.scrollOffset;

    scrollByX(this.galleryContainer, next > (max - 60) ? max : next);
  }

  moveLeft() {
    const next = this.galleryContainer.nativeElement.scrollLeft - this.scrollOffset;

    scrollByX(this.galleryContainer, next < 60 ? 0 : next);
  }

}
