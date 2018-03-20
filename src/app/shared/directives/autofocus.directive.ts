import {Directive, ElementRef, AfterViewInit, Input} from '@angular/core';

@Directive({
  selector: '[auto-focus]'
})
export class AutofocusDirective implements AfterViewInit {

  @Input() applyAutofocus: boolean = true;

  constructor(private el: ElementRef) { }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.applyAutofocus) return;

    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 1);
  }
}
