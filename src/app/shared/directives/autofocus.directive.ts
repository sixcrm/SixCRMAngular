import {Directive, ElementRef, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutofocusDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 1);
  }
}
