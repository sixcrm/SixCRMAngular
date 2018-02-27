import {Directive, ElementRef, OnDestroy, AfterViewInit, Output, EventEmitter, Input} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

@Directive({
  selector: '[visibleY]'
})
export class VisibleYDirective implements AfterViewInit, OnDestroy{

  period: number = 100;
  sub: Subscription;

  @Output() visible: EventEmitter<boolean> = new EventEmitter();
  @Input() offset: number = 0;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.sub = Observable.interval(this.period).subscribe(() => {
      this.isVisible();
    });
  }

  isVisible() {
    let el = this.elementRef.nativeElement;
    let rect = el.getBoundingClientRect();

    this.visible.emit(rect.top > -this.offset);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
