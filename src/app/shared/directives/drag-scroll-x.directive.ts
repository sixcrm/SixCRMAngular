import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[drag-scroll-x]',
  host: {
    '(pointermove)': 'onDrag($event)'
  }
})
export class DragScrollXDirective {

  constructor(private el: ElementRef) { }

  onDrag(event) {
    if (event.pressure !== 0 && !event.target.draggable) {
      const scrollLeft = this.el.nativeElement.scrollLeft - event.movementX;

      this.el.nativeElement.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;

      event.preventDefault();
    }
  }

}
