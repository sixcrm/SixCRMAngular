import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[sliderGalleryItem]'
})
export class SliderGalleryItemDirective {

  constructor(private el: ElementRef) { }

  getWidth() {
    return this.el.nativeElement.clientWidth;
  }
}
