import {Directive, Output, EventEmitter, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import {Observable, AsyncSubject} from 'rxjs';

@Directive({
  selector: '[inViewport]'
})
export class InViewportDirective implements AfterViewInit, OnDestroy{

  @Output('inside') inside: EventEmitter<boolean> = new EventEmitter();

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    Observable.interval(500).takeUntil(this.unsubscribe$).subscribe(() => {
      if (this.isVisible()) {
        this.inside.emit(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  isVisible(): boolean {
    let el = this.elementRef.nativeElement;
    let fromPoint = (x, y) => document.elementFromPoint(x, y);

    let rect = el.getBoundingClientRect();
    let vWidth = window.innerWidth || document.documentElement.clientWidth;
    let vHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
      return false;
    }

    return (
      el.contains(fromPoint(rect.left,  rect.top))
      ||  el.contains(fromPoint(rect.right, rect.top))
      ||  el.contains(fromPoint(rect.right, rect.bottom))
      ||  el.contains(fromPoint(rect.left,  rect.bottom))
    );
  }

}
